import { OAuth2Client } from 'google-auth-library';
import * as mail from '@googleapis/gmail';
import test, { expect } from '@playwright/test';

const { EMAIL_REFRESH_TOKEN, EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET, EMAIL_REDIRECT_URI  } = process.env;

function getAuthClient(): OAuth2Client  {
    const authClient = new OAuth2Client(
        EMAIL_CLIENT_ID,
        EMAIL_CLIENT_SECRET,
        EMAIL_REDIRECT_URI
      );
    authClient.setCredentials({ refresh_token: EMAIL_REFRESH_TOKEN });
    return authClient;
}

/**
 * Uses Gmail API to look in the user's inbox for a message with the given 
 * subject (complete match) and some anchor text to find in the body (partial match).
 * 
 * Conditional forwarding must be set up between the base email addresses used in 
 * .env file and the shared API-accessible gmail account.  Some instructions for
 * setting up Gmail API are here: https://stateful.com/blog/gmail-api-node-tutorial but
 * be sure to setup a separate, dummy account and DO NOT ENABLE GMAIL API ON YOUR
 * MAIN ACCOUNT.
 * @param originalEmail the email address of the user that the email
 * should have been sent to 
 * @param expectedSubject exact match on subject
 * @param textToFindInMessage a text blurb to look for in the body of the email
 * @returns true if the message was found, false otherwise.
 */
export async function hasUserReceivedEmail(originalEmail:string,
    expectedSubject:string,
    textToFindInMessage:string): Promise<boolean> {
    
    const foo = mail.gmail('v1')
    const gmail = mail.gmail({version: 'v1', auth: getAuthClient()}); 
    var numEmailsFound = 0;
    
    try {
        let foundMessages = false;
        var gmailMesssages;
        var retryNumber = 0;
        do {
            gmailMesssages = await gmail.users.messages.list(      
                {        
                userId: 'me',
                q: 'to:' + originalEmail              
                });
            foundMessages = gmailMesssages.data.messages != null;
            retryNumber++;
            if (!foundMessages) {
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        } while (retryNumber < 3 && !foundMessages)

        if (foundMessages && gmailMesssages) {
            gmailMesssages.data.messages?.forEach(message => {
                const messageId:string = message.id!;        
            }); 
            
            const messages = gmailMesssages.data.messages!;
            for (var i = 0; i < messages.length; i++) {
                const messageContents = await gmail.users.messages.get({userId: 'me', id: messages[i].id!, format:'RAW'})
                var messageText = messageContents.data.raw!
    
                var decoded = Buffer.from(messageText,'base64');
          
                const simpleParser = require('mailparser').simpleParser;
                const parsed = await simpleParser(decoded);
    
                const subject = parsed.headers.get('subject');
                const text = parsed.text;
    
                if (subject && subject.includes(expectedSubject) && text && text.includes(textToFindInMessage)) {
                    numEmailsFound++;
                    break;
                } 
            }
        }  
    } catch (e) {
        console.log('Could not get message ',e);
        return false;
    }

    console.log("Found " + numEmailsFound + " for email subject '" + expectedSubject + "' to " + originalEmail);
    return numEmailsFound == 1;
  }


/**
 * Checks via soft expectations that the emails have been received
 * @param emailedTo the email of the user to receive the emails
 * @param emailChecks list of subject and text searches
 */
export async function checkUserReceivedEmails(emailedTo:string, emailChecks: EmailCheck[]): Promise<void> {
    for (var i = 0; i < emailChecks.length; i++) {
        const email = emailChecks[i];
        const foundEmail = await hasUserReceivedEmail(emailedTo, email.subject, email.textProbe);
        await expect.soft(foundEmail, "Email '" + email.subject + "' to " + emailedTo).toBeTruthy();
    }
}
