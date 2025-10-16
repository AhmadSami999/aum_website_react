import { useEffect } from 'react';

// Hook to process resized images from rich text content
export const useResizedImages = () => {
  useEffect(() => {
    const processResizedImages = () => {
      // Find all images in rich text content
      const images = document.querySelectorAll('.rich-text-content img');
      
      images.forEach((img, index) => {
        console.log(`🔍 === DEBUGGING IMAGE ${index + 1} ===`);
        
        // Log ALL attributes to see what's actually there
        const allAttributes = {};
        for (let i = 0; i < img.attributes.length; i++) {
          const attr = img.attributes[i];
          allAttributes[attr.name] = attr.value;
        }
        console.log('🔍 ALL image attributes:', allAttributes);
        
        const containerStyle = img.getAttribute('containerstyle');
        const wrapperStyle = img.getAttribute('wrapperstyle');
        
        // Set width first
        if (containerStyle) {
          const widthMatch = containerStyle.match(/width:\s*(\d+px)/);
          if (widthMatch) {
            const width = widthMatch[1];
            img.style.width = width;
            img.style.maxWidth = 'none';
            img.style.height = 'auto';
          }
        }
        
        // Detect alignment from containerstyle margin
        let detectedAlignment = 'left'; // default
        
        if (containerStyle) {
          console.log('🔍 Container style:', containerStyle);
          
          // Look for the margin value in containerstyle
          const marginMatch = containerStyle.match(/margin:\s*([^;]+)/);
          if (marginMatch) {
            const margin = marginMatch[1].trim();
            console.log('🔍 Found margin in containerstyle:', margin);
            
            // Detect alignment patterns based on your debug output:
            // CENTER: "0px auto" (2-value: top/bottom left/right)
            // RIGHT: "0px 0px 0px auto" (4-value: top right bottom left, where left=auto)
            // LEFT: "0px" or "0px 0px 0px 0px" (no margins)
            
            if (margin === '0px auto') {
              detectedAlignment = 'center';
              console.log('🔍 Pattern: "0px auto" → CENTER');
            } else if (margin === '0px 0px 0px auto') {
              detectedAlignment = 'right';  // This is what right alignment produces!
              console.log('🔍 Pattern: "0px 0px 0px auto" → RIGHT');
            } else if (margin.includes('0px 0px 0px 0px') || margin === '0px') {
              detectedAlignment = 'left';
              console.log('🔍 Pattern: all zeros → LEFT');
            } else if (margin === 'auto 0px') {
              detectedAlignment = 'right';  // Alternative right pattern
              console.log('🔍 Pattern: "auto 0px" → RIGHT');
            } else if (margin.endsWith(' auto')) {
              detectedAlignment = 'right';  // Any margin ending with auto (left margin auto)
              console.log('🔍 Pattern: ends with " auto" → RIGHT');
            } else {
              console.log('🔍 Pattern: unknown margin pattern "' + margin + '" → LEFT (default)');
              detectedAlignment = 'left';
            }
          } else {
            console.log('🔍 No margin found in containerstyle');
          }
        }
        
        console.log('🎯 DETECTED ALIGNMENT:', detectedAlignment);
        
        // Apply alignment styles - clean approach that doesn't affect other elements
        if (detectedAlignment === 'left') {
          console.log('🎯 APPLYING LEFT ALIGNMENT');
          img.style.float = 'none';
          img.style.display = 'block';
          img.style.margin = '0.5rem auto 0.5rem 0'; // top right bottom left
          img.style.clear = 'both';
        } else if (detectedAlignment === 'right') {
          console.log('🎯 APPLYING RIGHT ALIGNMENT');
          img.style.float = 'none';
          img.style.display = 'block';
          img.style.margin = '0.5rem 0 0.5rem auto'; // top right bottom left
          img.style.clear = 'both';
        } else if (detectedAlignment === 'center') {
          console.log('🎯 APPLYING CENTER ALIGNMENT');
          img.style.float = 'none';
          img.style.display = 'block';
          img.style.margin = '0.5rem auto';
          img.style.marginLeft = 'auto';
          img.style.marginRight = 'auto';
          img.style.clear = 'both';
        } else {
          img.style.float = 'none';
          img.style.display = 'block';
          img.style.margin = '0.5rem 0';
          img.style.clear = 'both';
        }
      });
    };

    // Process images immediately
    processResizedImages();
    
    // Also process when DOM changes (for dynamically loaded content)
    const observer = new MutationObserver(processResizedImages);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['containerstyle']
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);
};

// Component version for easy usage
export const ResizedImageHandler = () => {
  useResizedImages();
  return null; // This component renders nothing
};