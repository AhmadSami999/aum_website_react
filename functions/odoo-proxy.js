// Complete Firebase Functions proxy with all actions
// functions/odoo-proxy.js

const functions = require('firebase-functions');

exports.handler = async (req, res) => {
  console.log('🚀 Enhanced Odoo Proxy Function Called');
  console.log('📥 Request method:', req.method);
  console.log('📥 Request body:', req.body);

  // Enable CORS for Firebase Functions
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).send('');
    return;
  }

  // Only allow POST requests for actual API calls
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
    return;
  }

  // ✅ UPDATED Odoo configuration with CORRECT credentials
  const ODOO_CONFIG = {
    baseUrl: 'https://aumalta-odooapi002-21875368.dev.odoo.com',
    db: 'aumalta-odooapi002-21875368',
    username: 'odooapi',
    password: 'c615111d4fa19f96bcb50bd602bad8a171b38c7c'
  };

  try {
    // Parse request body
    let requestBody = req.body || {};
    
    // If body is a string, parse it
    if (typeof requestBody === 'string') {
      try {
        requestBody = JSON.parse(requestBody);
      } catch (parseError) {
        console.log('❌ JSON parse error:', parseError);
        res.status(400).json({
          success: false,
          message: 'Invalid JSON in request body'
        });
        return;
      }
    }

    const { action, email, model, limit } = requestBody;
    console.log('🎯 Action requested:', action);

    // Validate action
    if (!action) {
      res.status(400).json({
        success: false,
        message: 'Missing "action" parameter'
      });
      return;
    }

    // Route to appropriate handler
    let result;
    switch (action) {
      case 'test_connection':
        result = await handleTestConnection(ODOO_CONFIG);
        break;
      
      case 'get_user_info':
        result = await handleGetUserInfo(ODOO_CONFIG, email);
        break;
      
      case 'search_student':
        result = await handleSearchStudent(ODOO_CONFIG, email);
        break;
      
      case 'get_all_students':
        result = await handleGetAllStudents(ODOO_CONFIG);
        break;

      case 'get_models':
        result = await handleGetModels(ODOO_CONFIG);
        break;
      
      case 'get_model_fields':
        result = await handleGetModelFields(ODOO_CONFIG, model);
        break;
      
      case 'get_model_data':
        result = await handleGetModelData(ODOO_CONFIG, model, limit);
        break;
      
      default:
        result = {
          success: false,
          message: `Unknown action: ${action}. Available actions: test_connection, get_user_info, search_student, get_all_students, get_models, get_model_fields, get_model_data`
        };
    }

    res.status(200).json(result);

  } catch (error) {
    console.error('💥 Function error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.toString()
    });
  }
};

// ✅ Test connection using JSON-RPC
async function handleTestConnection(config) {
  console.log('🔐 Testing Odoo authentication...');
  
  try {
    const uid = await authenticateOdoo(config);
    
    if (uid && uid > 0) {
      console.log('✅ Authentication successful! UID:', uid);
      
      return {
        success: true,
        uid,
        message: `Connected successfully! User ID: ${uid}`,
        timestamp: new Date().toISOString(),
        config: {
          baseUrl: config.baseUrl,
          database: config.db,
          username: config.username
        }
      };
    } else {
      return {
        success: false,
        message: 'Authentication failed - no valid UID in response'
      };
    }
  } catch (error) {
    console.error('💥 Connection test error:', error);
    return {
      success: false,
      message: `Connection error: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
}

// ✅ Get user info using JSON-RPC format - UPDATED to use op.student
async function handleGetUserInfo(config, userEmail) {
  console.log('👤 Getting student info for email:', userEmail);
  
  try {
    const uid = await authenticateOdoo(config);
    if (!uid) {
      throw new Error('Authentication failed');
    }

    console.log('✅ Authenticated with UID:', uid);

    // First, search for the user by email to get the user record
    let partnerId = null;
    let userId = null;

    if (userEmail) {
      // Search for user by email
      const userSearchResponse = await fetch(`${config.baseUrl}/jsonrpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            service: 'object',
            method: 'execute_kw',
            args: [
              config.db,
              uid,
              config.password,
              'res.users',
              'search_read',
              [[['email', '=', userEmail]]],
              {
                fields: ['id', 'name', 'email', 'partner_id'],
                limit: 1
              }
            ]
          }
        })
      });

      const userSearchResult = await userSearchResponse.json();
      console.log('🔍 User search result:', userSearchResult);

      if (userSearchResult.result && userSearchResult.result.length > 0) {
        const user = userSearchResult.result[0];
        userId = user.id;
        partnerId = user.partner_id ? user.partner_id[0] : null;
        console.log('👤 Found user:', user.name, 'Partner ID:', partnerId, 'User ID:', userId);
      }
    }

    // Now search for student record using either partner_id or user_id
    let studentSearchDomain = [];
    if (partnerId) {
      studentSearchDomain = [['partner_id', '=', partnerId]];
    } else if (userId) {
      studentSearchDomain = [['user_id', '=', userId]];
    } else if (userEmail) {
      // Fallback: search partner by email and then find student
      const partnerSearchResponse = await fetch(`${config.baseUrl}/jsonrpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            service: 'object',
            method: 'execute_kw',
            args: [
              config.db,
              uid,
              config.password,
              'res.partner',
              'search_read',
              [[['email', '=', userEmail]]],
              {
                fields: ['id', 'name', 'email'],
                limit: 1
              }
            ]
          }
        })
      });

      const partnerResult = await partnerSearchResponse.json();
      if (partnerResult.result && partnerResult.result.length > 0) {
        partnerId = partnerResult.result[0].id;
        studentSearchDomain = [['partner_id', '=', partnerId]];
      }
    }

    // Search for student record
    if (studentSearchDomain.length > 0) {
      const studentSearchResponse = await fetch(`${config.baseUrl}/jsonrpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            service: 'object',
            method: 'execute_kw',
            args: [
              config.db,
              uid,
              config.password,
              'op.student',
              'search_read',
              [studentSearchDomain],
              {
                fields: [
                  'id',
                  'gr_no',           // Registration Number (AUM ID)
                  'first_name',
                  'middle_name', 
                  'last_name',
                  'name',            // Full name
                  'email',
                  'phone',
                  'mobile',
                  'birth_date',
                  'gender',
                  'partner_id',
                  'user_id',
                  'active'
                ],
                limit: 1
              }
            ]
          }
        })
      });

      const studentResult = await studentSearchResponse.json();
      console.log('🎓 Student search result:', studentResult);

      if (studentResult.result && studentResult.result.length > 0) {
        const student = studentResult.result[0];
        
        // Build full name from parts if needed
        let fullName = student.name;
        if (!fullName && (student.first_name || student.last_name)) {
          const nameParts = [
            student.first_name,
            student.middle_name,
            student.last_name
          ].filter(Boolean);
          fullName = nameParts.join(' ');
        }

        return {
          success: true,
          uid,
          userDetails: {
            odooId: student.id,                    // Student record ID
            name: fullName || 'Unknown Student',  // Full student name
            email: student.email || userEmail,    // Student email
            phone: student.phone || student.mobile,
            registrationNumber: student.gr_no,    // This is the AUM ID!
            
            // Store individual name parts
            firstName: student.first_name,
            middleName: student.middle_name,
            lastName: student.last_name,
            
            // Additional student info
            birthDate: student.birth_date,
            gender: student.gender,
            isActive: student.active,
            
            // IDs for relationships
            partnerId: student.partner_id ? student.partner_id[0] : null,
            userId: student.user_id ? student.user_id[0] : null,
            
            // Debug info
            allStudentFields: student
          },
          message: `Found student: ${fullName} (ID: ${student.gr_no})`,
          timestamp: new Date().toISOString()
        };
      }
    }

    // Fallback: return API user info if no student found
    const userResponse = await fetch(`${config.baseUrl}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            config.db,
            uid,
            config.password,
            'res.users',
            'read',
            [uid],
            {
              fields: ['name', 'email', 'login']
            }
          ]
        }
      })
    });

    const userResult = await userResponse.json();
    
    if (userResult.result && userResult.result.length > 0) {
      const user = userResult.result[0];
      
      return {
        success: true,
        uid,
        userDetails: {
          odooId: uid,
          name: user.name,
          email: user.email,
          login: user.login,
          registrationNumber: `API-${uid}`,
          isApiUser: true
        },
        message: `No student found, using API user: ${user.name}`,
        timestamp: new Date().toISOString()
      };
    }
    
    throw new Error('No user or student found');

  } catch (error) {
    console.error('💥 User info error:', error);
    return {
      success: false,
      message: `User info error: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
}

// Get all available models
async function handleGetModels(config) {
  console.log('📋 Getting all models...');
  
  try {
    const uid = await authenticateOdoo(config);
    if (!uid) {
      throw new Error('Authentication failed');
    }

    // Get all models
    const response = await fetch(`${config.baseUrl}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            config.db,
            uid,
            config.password,
            'ir.model',
            'search_read',
            [[]],
            {
              fields: ['model', 'name'],
              order: 'model'
            }
          ]
        }
      })
    });

    const result = await response.json();
    
    return {
      success: true,
      models: result.result || [],
      count: result.result ? result.result.length : 0,
      message: `Found ${result.result ? result.result.length : 0} models`,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('💥 Get models error:', error);
    return {
      success: false,
      message: `Error: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
}

// Get fields for a specific model
async function handleGetModelFields(config, modelName) {
  console.log('📋 Getting fields for model:', modelName);
  
  try {
    const uid = await authenticateOdoo(config);
    if (!uid) {
      throw new Error('Authentication failed');
    }

    // Get model fields
    const response = await fetch(`${config.baseUrl}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            config.db,
            uid,
            config.password,
            modelName,
            'fields_get',
            [],
            {
              attributes: ['string', 'type', 'required', 'readonly', 'help']
            }
          ]
        }
      })
    });

    const result = await response.json();
    
    return {
      success: true,
      fields: result.result || {},
      model: modelName,
      message: `Retrieved fields for ${modelName}`,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('💥 Get model fields error:', error);
    return {
      success: false,
      message: `Error: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
}

// Get sample data for a model
async function handleGetModelData(config, modelName, limit = 5) {
  console.log('📊 Getting sample data for model:', modelName);
  
  try {
    const uid = await authenticateOdoo(config);
    if (!uid) {
      throw new Error('Authentication failed');
    }

    // Get sample records
    const response = await fetch(`${config.baseUrl}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            config.db,
            uid,
            config.password,
            modelName,
            'search_read',
            [[]],
            {
              limit: limit
            }
          ]
        }
      })
    });

    const result = await response.json();
    
    return {
      success: true,
      records: result.result || [],
      model: modelName,
      count: result.result ? result.result.length : 0,
      message: `Retrieved ${result.result ? result.result.length : 0} records from ${modelName}`,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('💥 Get model data error:', error);
    return {
      success: false,
      message: `Error: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
}

// Get all students from op.student model
async function handleGetAllStudents(config) {
  console.log('📋 Getting all students from op.student...');
  
  try {
    const uid = await authenticateOdoo(config);
    if (!uid) {
      throw new Error('Authentication failed');
    }

    const response = await fetch(`${config.baseUrl}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            config.db,
            uid,
            config.password,
            'op.student',
            'search_read',
            [[]],
            {
              fields: [
                'id', 
                'gr_no',        // Registration Number (AUM ID)
                'name',         // Full name
                'first_name',
                'middle_name',
                'last_name',
                'email',
                'phone',
                'mobile',
                'birth_date',
                'gender',
                'active',
                'partner_id',
                'user_id'
              ],
              limit: 20
            }
          ]
        }
      })
    });

    const result = await response.json();
    
    return {
      success: true,
      students: result.result || [],
      count: result.result ? result.result.length : 0,
      message: `Found ${result.result ? result.result.length : 0} students in op.student`,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('💥 Get all students error:', error);
    return {
      success: false,
      message: `Error: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
}

// Search for specific student
async function handleSearchStudent(config, email) {
  console.log('🔍 Searching for student with email:', email);
  
  try {
    const uid = await authenticateOdoo(config);
    if (!uid) {
      throw new Error('Authentication failed');
    }

    const response = await fetch(`${config.baseUrl}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            config.db,
            uid,
            config.password,
            'res.partner',
            'search_read',
            email ? [[['email', '=', email]]] : [[]],
            {
              fields: ['id', 'name', 'email'],
              limit: 5
            }
          ]
        }
      })
    });

    const result = await response.json();
    
    return {
      success: true,
      students: result.result || [],
      count: result.result ? result.result.length : 0,
      message: `Found ${result.result ? result.result.length : 0} students`,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('💥 Search student error:', error);
    return {
      success: false,
      message: `Search error: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
}

// ✅ Authenticate using JSON-RPC
async function authenticateOdoo(config) {
  try {
    console.log('🔐 Authenticating with Odoo...');
    
    const response = await fetch(`${config.baseUrl}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'common',
          method: 'authenticate',
          args: [config.db, config.username, config.password, {}]
        }
      })
    });

    const result = await response.json();
    console.log('🔐 Authentication result:', result);

    if (result.result) {
      return result.result;
    } else {
      throw new Error('Authentication failed');
    }
  } catch (error) {
    console.error('❌ Authentication error:', error);
    throw error;
  }
}