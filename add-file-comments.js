const fs = require('fs').promises;
const path = require('path');

// The directory to search (can be changed via command line argument)
const rootDir = process.argv[2] || '.my-app/src';

/**
 * Recursively gets all files from a directory
 * @param {string} dir Directory to search
 * @returns {Promise<string[]>} Promise resolving to an array of file paths
 */
async function getFiles(dir) {
  const items = await fs.readdir(dir);
  
  const files = await Promise.all(items.map(async (item) => {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      // Recursively scan directories
      return getFiles(fullPath);
    } else {
      return fullPath;
    }
  }));
  
  // Flatten the array of arrays into a single array
  return files.flat();
}

/**
 * Adds a comment with the filename at the beginning of the file
 * @param {string} filePath Path to the file
 */
async function addFileNameComment(filePath) {
  // Only process .js and .css files
  const ext = path.extname(filePath);
  if (ext !== '.js' && ext !== '.css') {
    return;
  }
  
  // Get the filename
  const fileName = path.basename(filePath);
  
  // Read the file content
  const content = await fs.readFile(filePath, 'utf8');
  
  // Create the comment
  const comment = `/* ${fileName} */\n`;
  
  // Check if the comment already exists at the beginning
  if (content.startsWith(comment)) {
    console.log(`Comment already exists in ${filePath}`);
    return;
  }
  
  // Prepend the comment to the content
  const newContent = comment + content;
  
  // Write the new content back to the file
  await fs.writeFile(filePath, newContent, 'utf8');
  
  console.log(`Added comment to ${filePath}`);
}

/**
 * Main function to process all files
 */
async function main() {
  try {
    // Get all files in the directory
    const files = await getFiles(rootDir);
    
    // Process each file
    for (const file of files) {
      await addFileNameComment(file);
    }
    
    console.log('All files processed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
