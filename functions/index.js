const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

// Import the separate odoo-proxy file
const odooProxy = require('./odoo-proxy');

admin.initializeApp();

// Export the Odoo proxy function from the separate file
exports.odooProxy = functions.https.onRequest(odooProxy.handler);

// Existing user management functions
exports.createUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const {email, role, password} = req.body;

    if (!email || !role || !password) {
      return res
          .status(400)
          .json({error: "Missing email, role, or password"});
    }

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      await admin
          .firestore()
          .collection("users")
          .doc(userRecord.uid)
          .set({
            email,
            role,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

      res.status(200).json({uid: userRecord.uid, email, role});
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({error: err.message});
    }
  });
});

exports.deleteUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const {uid} = req.body;

    if (!uid) {
      return res.status(400).json({error: "Missing UID"});
    }

    try {
      await admin.auth().deleteUser(uid);
      await admin.firestore().collection("users").doc(uid).delete();

      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).json({message: "User deleted"});
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({error: error.message});
    }
  });
});