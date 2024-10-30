import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

/// Magyar Képzömüvészeti Egyetem Neptun
//const baseUrl = 'https://mke-neptun.mke.hu/hallgato'

/// Szapientia Egyetem Neptun
const baseUrl = 'https://host.sdakft.hu/semtehw';


const detailsUrl = `${baseUrl}/main.aspx?ismenuclick=true&ctrl=0101`;

// Function to log in and retrieve session cookies
async function login(username: string, password: string): Promise<string[]> {
    const data = {
        captcha: '',
        GUID: null,
        pwd: password,
        user: username,
        UserLogin: null
    };

    const response = await axios.post(`${baseUrl}/Login.aspx/CheckLoginEnable`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const cookies = response.headers['set-cookie'];

    if (!cookies || !cookies.some(cookie => cookie.includes('.ASPXAUTH'))) {
        throw new Error('Login failed: .ASPXAUTH cookie not found');
    }

    return cookies; // Return the array of cookies
}

// Function to retrieve and scrape details from the specified table
async function getDetails(cookies: string[]): Promise<any> {
    try {
        const response = await axios.get(detailsUrl, {
            headers: {
                Cookie: cookies.join('; ') // Include cookies in the request
            }
        });

        const soup = cheerio.load(response.data);

        // CSS selector to target the specific table (adjust as necessary)
        const tableSelector = 'form fieldset table:nth-of-type(2) tbody tr td:nth-of-type(3) table tbody tr:nth-of-type(5) td:nth-of-type(2) div div:nth-of-type(1) div div:nth-of-type(2) div:nth-of-type(1) div table:nth-of-type(1) tbody tr:nth-of-type(2) td:nth-of-type(1) table:nth-of-type(2)';

        const targetTable = soup(tableSelector); // Select the target table

        const data: { [key: string]: string } = {}; // Object to hold scraped data

        // Extracting data from the target table
        targetTable.find('tr').each((index, row) => {
            const rowData = soup(row).find('td span.tableRowData').text().trim();
            if (rowData) {
                data[`row_${index}`] = rowData; // Store data dynamically
            }
        });

        // Save data to a file (tables.txt)
        fs.writeFileSync('tables.txt', JSON.stringify(data, null, 2), 'utf8');
        console.log('Data saved to tables.txt');

        return data;
    } catch (error) {
        console.error('Error fetching details:', error);
        throw error; // Rethrow for handling in the calling function
    }
}

// Main function to orchestrate login and data retrieval
async function main() {
    try {
        const myUsername = 'NZ1ZEX'; // Replace with your username
        const myPassword = 'Henyke2003'; // Replace with your password

        const authCookies = await login(myUsername, myPassword); // Log in to get cookies
        const details = await getDetails(authCookies); // Get details from the specified table

        console.log('Details:', details); // Log the extracted details
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the main function
main();
