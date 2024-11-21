import axios from 'axios';
import { AxiosError } from 'axios';


import * as cheerio from 'cheerio';

const baseUrl = 'https://host.sdakft.hu/semtehw';
const detailsUrl = `${baseUrl}/main.aspx?ismenuclick=true&ctrl=0101`;

export async function loginToNeptun(username: string, password: string): Promise<string[]> {
  const data = {
    captcha: '',
    GUID: null,
    pwd: password,
    user: username,
    UserLogin: null,
  };

  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';


  try {
    console.log("Sending Neptun login request with data:", data);
    const response = await axios.post(`${baseUrl}/Login.aspx/CheckLoginEnable`, data, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent
      },
    });
    const cookies = response.headers['set-cookie'];
    if (!cookies || !cookies.some(cookie => cookie.includes('.ASPXAUTH'))) {
      throw new Error('Login failed: .ASPXAUTH cookie not found');
    }
    return cookies;
  }
  catch (error: any) {
    console.error("Neptun login error:", error.response?.data || error.message);
    throw new Error('Failed to login to Neptun');
  }
}

export async function getDetails(cookies: string[]): Promise<{ [key: string]: string }> {
  
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  try {
    const response = await axios.get(detailsUrl, {
      headers: {
        Cookie: cookies.join('; '),
        'User-Agent': userAgent
      }
    });
    const $ = cheerio.load(response.data);
    return {
      neptun_code: $('#dtbTorzsadatok_dtrow128dataTitleValue > span.tableRowData').text().trim(),
      name: $('#dtbTorzsadatok_dtrow8332dataTitleValue > span.tableRowData').text().trim(),
      kepzes: $('#lblTrainingName').text().trim(),
    };
  } catch (error) {
    console.error("Error fetching details from Neptun:", error);
    throw new Error("Failed to fetch Neptun details");
  }
}
