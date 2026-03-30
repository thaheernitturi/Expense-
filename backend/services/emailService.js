const SibApiV3Sdk = require("sib-api-v3-sdk");

exports.sendEmail = async (to, content) => {
  const client = SibApiV3Sdk.ApiClient.instance;

  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.API_KEY;

  const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  await tranEmailApi.sendTransacEmail({
    sender: {
      email: "thaheernitturi@gmail.com",
      name: "Expense Tracker",
    },
    to: [{ email: to }],
    subject: "Reset Password",
    htmlContent: content,
    textContent: "Reset your password",
  });
};