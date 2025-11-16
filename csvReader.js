const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// List of CSV files to search
const CSV_FILES = [
    'products_a.csv', 
    'products_b.csv', 
    'products_c.csv',
    'products_d.csv',
    'products_e.csv'
];

/**
 * Searches across all CSV files for a given product ID using low-memory streaming.
 * @param {string} targetId - The ID to search for.
 * @returns {Promise<Array<Object>>} - A Promise resolving to an array of matching products (could be empty).
 */
function searchAcrossFiles(targetId) {
    return new Promise(async (resolve, reject) => {
        const matchingProducts = [];
        let filesProcessed = 0;

        // Function to process a single file stream
        const processFile = (fileName) => {
            return new Promise((fileResolve) => {
                const filePath = path.join(__dirname, fileName);
                const stream = fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => {
                        // Check for a match
                        if (data.id === targetId) {
                            matchingProducts.push(data);
                        }
                    })
                    .on('error', (error) => {
                        console.error(`Error reading ${fileName}:`, error.message);
                        fileResolve(); // Resolve file promise even on error
                    })
                    .on('end', () => {
                        fileResolve(); // Resolve when file stream finishes
                    });
            });
        };

        // Process all files sequentially (optional, but cleaner for error handling)
        for (const fileName of CSV_FILES) {
            await processFile(fileName);
        }

        // Once all files are processed, resolve the main promise with the results
        resolve(matchingProducts);
    });
}

module.exports = { searchAcrossFiles };