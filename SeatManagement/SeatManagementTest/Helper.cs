using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace SeatManagementTest
{
    internal class Helper
    {
        public static string TestUri = "https://localhost:7212/api";

        public static HttpClient GetHttpClient()
        {
            var httpClient = new HttpClient(new HttpClientHandler
            {
                UseCookies = true,
                UseDefaultCredentials = true,
                Credentials = CredentialCache.DefaultCredentials,
                AutomaticDecompression = DecompressionMethods.GZip
            });

            httpClient.DefaultRequestHeaders.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
            //httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "access_token");

            return httpClient;
        }

        public static string GetUrl(string method)
        {
            return $"{TestUri}/{method}";
        }
    }
}
