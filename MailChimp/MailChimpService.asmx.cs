using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;

using System.Text.RegularExpressions;
using System.Net;
using System.Text;
using System.IO;
using System.Xml;


namespace MailChimp
{
    /// <summary>
    /// Summary description for MailChimpService
    /// </summary>
    [WebService(Namespace = "http://fele.com/")]
    [System.ComponentModel.ToolboxItem(false)]

    [System.Web.Script.Services.ScriptService]
    public class MailChimpService : System.Web.Services.WebService
    {
        private JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
        private Dictionary<string, string> returnValue = new Dictionary<string, string>();
        private enum status { SUCCESS, ERROR};
        private string api_key=System.Web.Configuration.WebConfigurationManager.AppSettings["MailChimp:apiKey"];
        private string server = System.Web.Configuration.WebConfigurationManager.AppSettings["MailChimp:server"];
        private string list_key = "";
        
        private int responseCode;

        [WebMethod]
        public Dictionary<string, string> ListSubscribe(string email, string listIndex, string merge_vars, string groupings, string email_type)
        {
            if(checkEmail(email)){
                list_key = System.Web.Configuration.WebConfigurationManager.AppSettings["MailChimp:listKey"+listIndex];
            
                MergeVars mergeVars = jsonSerializer.Deserialize<MergeVars>(merge_vars);

                string mergeVars_url = "&merge_vars[OPTIN_TIME]=now";
                foreach (MergeVar thisMergeVar in mergeVars.merge_vars)
                {
                    mergeVars_url += "&merge_vars["+thisMergeVar.key+"]="+HttpUtility.UrlEncode(thisMergeVar.value);
                }

                Groupings groupingsDeserialized = jsonSerializer.Deserialize<Groupings>(groupings);

                string groupings_url = "";
                foreach (Grouping thisGroup in groupingsDeserialized.groupings)
                {
                    groupings_url += "&merge_vars[GROUPINGS][0][name]=" + HttpUtility.UrlEncode(thisGroup.key) + "&merge_vars[GROUPINGS][0][groups]=" + HttpUtility.UrlEncode(thisGroup.value);
                }

                string url = "https://" + server + ".api.mailchimp.com/1.3/?method=listSubscribe&apikey=" + api_key + "&id=" + list_key + "&email_address=" + HttpUtility.UrlEncode(email) + mergeVars_url + groupings_url + "&email_type=" + email_type + "&update_existing=true&double_optin=true";
                returnValue.Add("url", url);

                GetUrl(url);
                //GetUrl("https://" + server + ".api.mailchimp.com/1.3/?method=listInterestGroupings&apikey=" + api_key + "&id=" + list_key);
            
                returnValue.Add("status", status.SUCCESS.ToString());

                return returnValue;
            } else {
                returnValue.Add("status", status.ERROR.ToString());
                returnValue.Add("message", "Invalid Email");
                return returnValue;
            }
        }

        private void GetUrl(string uri)
        {
            WebRequest request = WebRequest.Create(uri);
            string responseFromServer = "";

            try
            {
                // Get the response.
                WebResponse response = request.GetResponse();

                // Get the stream containing content returned by the server.
                Stream dataStream = response.GetResponseStream();

                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);

                // Read the content.
                responseFromServer = reader.ReadToEnd();

                reader.Close();
                dataStream.Close();
                response.Close();

                returnValue.Add("GetUrlResponse", responseFromServer);

            }
            catch (WebException we)
            {
                if (we.Status == WebExceptionStatus.ProtocolError)
                {
                    responseCode = (int)((HttpWebResponse)we.Response).StatusCode;
                }
                else
                {
                    responseCode = 500;
                }

                returnValue.Add("currentStatus", responseCode.ToString());
            }
        }
        
        private bool checkEmail(string email)
        {
            Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
            Match match = regex.Match(email);
            return match.Success;
        }

        public class MergeVar
        {
            public string key {get; set;}
            public string value {get; set;}
        }

        public class MergeVars
        {
            public List<MergeVar> merge_vars = new List<MergeVar>();
        }


        public class Grouping
        {
            public string key { get; set; }
            public string value { get; set; }
        }

        public class Groupings
        {
            public List<Grouping> groupings = new List<Grouping>();
        }
    }
}
