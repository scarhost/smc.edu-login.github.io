/* Default field names on the login form displayed */
var FLD_DSP_USER 	= DEF_FLD_USERNAME;
var FLD_DSP_PASS 	= DEF_FLD_PASSWORD;
var FLD_NEWPW 		= DEF_FLD_NEWPW;
/* Default field names on the login form submitted (not necessarily the same) */
var FLD_SUBMIT_USER = DEF_FLD_USERNAME;
var FLD_SUBMIT_PASS = DEF_FLD_PASSWORD;

var DEF_SSO_PAGE = "/sso/default.aspx";
var PG_LL_RELOGIN_TIME = 4500;	/* In milliseconds */

// These settings control how long the browser waits during FIDO U2F security key and WebAuthn operations
var FIDOU2F_REGISTER_TIMEOUT = 30;	/* In seconds */
var FIDOU2F_SIGNIN_TIMEOUT = 30;	/* In seconds */
var WEBAUTHN_REGISTER_TIMEOUT = 30;	/* In seconds */
var WEBAUTHN_SIGNIN_TIMEOUT = 30;	/* In seconds */

/* Buttons to show on Login form */
var bShowSetPWButton = false;    /* SMC. was true */
var bShowForgotPWButton = false;  /* SMC. was true */
// Changes behavior of Logout links on PortalGuard's pages - set to true as part of utilizing SAML Single Log Out (SLO) - 
//	See the PortalGuard Admin Guide for full instructions on configuring SLO
var g_bUseSingleLogout = false;

// Set to number of days "remember username" cookie will persist and automatically populate username value. 
//	Set to 0 to disable this functionality and hide the associated checkbox.
//	Set to -1 to have the cookie only last for the current browser session
var g_rememberUsernameDays = 0;

var g_arrUserPrefixes  = [ 
							/*["targetserver1", "DOMAIN1\\"], 
							["targetserver2", "DOMAIN2\\"] */
						  ];


/* Generic messages */
var msg_CONTACT_HD = "<br /><br />Contact the <span class='italicsEmphasis'>Help Desk</span> to help determine the issue.";

/* Put in logo the path below! */
var LOGIN_LOGO_PATH = "/_layouts/images/PG/images/SMClogo-dark.svg";
//var LOGIN_LOGO_PATH = "/_layouts/images/PG/images/SMClogoRxwhite10.png";
//var branding_Logo = "<a href='https://www.smc.edu' target='_blank'><img id='BrandedLogo' class='center-block img-responsive' alt='Home Page Logo' src='/_layouts/images/PG/images/SMClogoRxwhite10.png' /></a>";
var branding_Logo = "<a href='https://www.smc.edu' target='_blank'><img id='BrandedLogo' class='center-block img-responsive' alt='' src='/_layouts/images/PG/images/SMClogo-dark.svg' /></a>";

//var branding_Logo = "";

//var hdPhone = "" //SMC removed
var hdContact = "<UL><B>STUDENTS:</B><ul><li>Email StudentITHelp@smc.edu or</li><li>Call 310-434-3111 Mon-Fri 8am-9pm  </li></UL><b>EMPLOYEES:</b><ul><li>Email ITHelp@smc.edu or</li><li>Call 310-434-3010  Mon-Thu 7am-6pm  and Fri 7am-5:00pm </LI></UL></ul>";
//function getFooterText() {return "<p>Having Trouble? <a href='mailto:support@acme.com'>Contact Support</a></p>";}
//function getFooterCopyright() {return "<div id='copyrightLogoContainer'><a href='https://bio-key.com' target='_blank' id='footerLogo'><img id='footerCorporateLink' src='/_layouts/images/PG/images/SMClogo-blue.png'></a></div><div id='footerHelp'>Having Trouble? <a href='mailto:itHelp@smc.edu'>Contact Support</a></div><div id='copyrightTextContainer'>&#169; 2021 Santa Monica College<sup>&#174</sup>&nbsp;<a href='https://www.smc.edu' target='_blank'>Privacy Policy</a>.</div>";}
//function getFooterCopyright() {return "<div id='copyrightLogoContainer'>Note: The wall paper on this page (signon.smc.edu) will be changed soon.</div>";}
//function getFooterCopyright() {return "<div id='copyrightLogoContainer'>Note: Canvas is currently experiencing slowness/degradation issues. Canvas is actively working to resolve this issue. You can monitor the status at <a href='https://status.instructure.com' target='_blank' id='footerLogo'>https://status.instructure.com</a></div>";}
function getFooterCopyright() {return "<div id='copyrightLogoContainer'></div>";}

function PG_Custom_Init() {
	setLoginLogo();
	setFormFocus(frmMainLogon);
	showPWFieldCheckboxes(true);   /* SMC was false */
	createHiddenTOUField();
	setLoginType(1);	// Use 2 for OTP or RBA logins
	showLoginFormButtons();	// 2014-08-22 - Moved down here to allow programmatic hide of SS button
	bDDQuestions = true;
	g_AutoAdvanceSSActionChoice = true;
	g_SetPW_CopyPWFromParent = true;
	getUsernamePrefix();
	g_bShowAllPWRules = true;
	g_bSubmitFromSSPWReset = true;
	
	//showPWLessLinkOnLoginForm(true);  // Show FIDO2 passwordless button on Login page?
	
	// Show or hide phone type buttons (if voice OTP is not supported)
	hideMobilePhoneTypeSelector(true);
	
	//g_bClearPWFieldsOnMismatch = true;
	//g_bShowServerSidePWRules = true;
	
	try {
		// Placeholder Text for Username Input fields throughout Login.aspx -- CRP 2018-09-12
		var MainUnameInput = document.getElementById("frmLogin_UserName");
		var SSUnameInput = document.getElementById("UsernameSS");
		var SetPWUnameInput = document.getElementById("UsernameSetPW");
		var PlaceholderText = "ex: user123";
		
		//MainUnameInput.placeholder = SSUnameInput.placeholder = SetPWUnameInput.placeholder = PlaceholderText;
	} catch (ex) {
		console.log("Caught exception setting username field placeholder text", ex);
	}
}

function showPWLessLinkOnLoginForm(bShow) {
	if (!bShow)
		return;
	
	try {
		var lbl = document.getElementById("divMainPWLabel");
		if (null == lbl || null != document.getElementById('spnPWLessLogin'))
			return;
		var lnk = document.createElement("span");
		lnk.id = "spnPWLessLogin";
		lbl.appendChild(lnk)
		var txt = "<span style='float:right'><a href=''; onclick='doFIDO2PWLess(); return false;' style='font-weight:400; font-size:0.9em'>" + getBtnFIDO2PWLess() + "</a></span>";
		setElemContent(txt, ["spnPWLessLogin"]);
	} catch (ex) {
		console.log("Caught exception passwordless link text", ex);
	}
}

function setLoginLogo() { try { var img = document.getElementById("LogoImg").src = LOGIN_LOGO_PATH; } catch (ex) {} }
function getBlankUserMsg() { return showError("Missing Username", "Please provide a valid username"); }
function getBlankPwMsg() { return showError("Missing Password", "Please provide a password"); }
function getBlankNewPwMsg() { return showError("", "No new password provided"); }
function getMismatchedPwMsg() { return showError("", "New passwords do not match"); }
function getBlankChallengeAnswer() { return showError("", "No challenge answer provided"); }

function getMainFormTitle() { return branding_Logo; }
function getSetPWTitle() { return "Set Password"; }
function getLoginCATitle() { return "Knowledge-based Login Required"; }
function getOTPEnrollTitle(thetype) { 
	if (AUTHTYPE_2FA_METHOD_PHONE == thetype)
		return "Phone Enrollment";		
	if (AUTHTYPE_2FA_METHOD_EMAIL == thetype)
		return "Email Enrollment";
	return "Secondary Enrollment";
 }
function getOTPEntryTitle() { return "Multi-Factor Login Required"; }
function getSSTitle() { return "End-User Self Service"; }
function getAcctLinkTitle() { return "User Account Linking"; }

function getUsernameLabel() { return "Username"; }
function getPasswordLabel() { return "Password"; }
function getNewPWLabel() { return "New Password"; }
function getConfPWLabel() { return "Confirm Password"; }
function getOTPLabel() { return "2nd Factor / One Time Passcode"; }
function getShowPWLabel() { return "Show password"; }
function getPhoneCountryLabel() { return "Country"; }
function getPhoneNumberLabel() { return "Phone Number"; }
function getPhoneProviderLabel() { return "Phone Provider"; }
function getPhoneTypeLegend() { return "Phone Type"; }
function getPhoneCanTextYesLabel() { return "Phone can receive SMS/text messages"; }
function getPhoneCanTextNoLabel() { return "Phone " + boldSpan("cannot") + " receive SMS/text messages"; }
function getRememberDeviceLabel() { return boldGreenSpan("Remember this device?"); }
function getRememberDeviceInstr() { return "Remembering this browser prevents extra login prompts. You should " + boldSpan("NOT") + " enable this on public/shared computers."; }
function getRememberDeviceDescLabel() { return "Browser Description"; }
function getRememberUsernameLabel() { return "Remember username"; }
function getRememberMeSSOLabel() { return "Remember me on this browser"; }
function getLanguageLabel() { return "Language: "; }
function getChangeLanguageButtonText() { return "Change"; }
function getChangeSSOTileSizeButtonText() { return "Change"; }
function getNewUsernameLabel() { return "New Username"; }
function getPWStrengthLabel() { return "Password Strength"; }

function getSSRecoveryOptionsAvailableLabel() { return "Recovery Actions Available"; }
function getSSEnrollOptionsAvailableLabel() { return "Enrollment Actions Available"; }
function getSSRequestedActionLabel() { return "Requested Action"; }
function getSSAuthTypes() { return "Authentication Types Available"; }
function getEmailEnrollTitle() { return "Email Enrollment"; }
function getEmailAddrLabel() { return "Email Address"; }
function getQuestionSelectLabel() { return "Choose a challenge answer"; }
function getSSPermSuppressLabel() { return boldRedSpan("Permanently Suppress Reminders"); }
function getSSAnsRemainLabel() { return "Answers remaining: "; }
function getCAPTCHAInstructions() { return "Please answer the CAPTCHA below"; }
function getResendOTPLinkText(delivery) { return delivery == PG_OTP_VOICEBIO ? "Problems with the voice phrase?" : "Problems with this authentication option?"; }

function getMainUsernameLabel() { return "Main Username"; }
function getAcctLinkRepoSysLabel() { return "Repository/System"; }
function getAcctLinkLinkedAcctNameLabel() { return "Secondary Username"; }
function getAcctLinkLinkedAcctPWLabel() { return "Secondary Password"; }

function getLogoHTML() { return "<img class='acctLogo' src='" + LOGIN_LOGO_PATH + "' alt='Home Page Logo'/>"; }
function getAcctMgmtTitle() { return "&nbsp;Account Management"; }
function getLoggedInAs(nm) { return italicizeSpan(nm); }
function getLogout() { return "Log Out"; }
function getAcctMgmtLinkText() { return "Manage Your Account Settings"; }
function getSSOLinkText() { return "Go to SSO Jump Page"; }

function getNoDateString() { return "[Never]"; }
function getAcctMgmtTime(time) { return "<span class='activityData'>" + time + "</span>"; }
function getAcctMgmtActivityText() { return "Account Details & Activity"; }
function getAcctMgmtActivityHdr() { return "<h3><img class='acctActivity' alt='Notepad and pencil icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtActivityText() + "</h3>"; }
function getAcctMgmtSettingsText() { return "Multi-Factor Delivery Methods"; }
function getAcctMgmtSettingsHdr() { return "<h3><img class='acctCPanel' alt='Configuration panel icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtSettingsText() + "</h3>"; }
function getAcctMgmtCQAText() { return "Challenge Questions"; }
function getAcctMgmtCQAHdr() { return "<h3><img class='acctQuestion' alt='Question mark icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtCQAText() + "</h3>"; }
function getAcctMgmtAcctLinkText() { return "Linked User Accounts"; }
function getAcctMgmtAcctLinkHdr() { return "<h2><img class='acctServer' alt='Server icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtAcctLinkText() + "</h2>"; }
function getAcctMgmtAcctOptIn2FAText() { return "Enable/Disable Multi-Factor"; }
function getAcctMgmtAcctOptIn2FAHdr() { return "<h2><img class='acctPhoneMobile' alt='Mobile phone icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtAcctOptIn2FAText() + "</h2>"; }
function getAcctMgmtPhonesText() { return "Registered Phones"; }
function getAcctMgmtPhonesHdr() { return "<h3><img class='acctPhoneMobile' alt='Mobile phone icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtPhonesText() + "</h3>"; }
function getAcctMgmtEmailText() { return "Registered Email Address"; }
function getAcctMgmtEmailHdr() { return "<h3><img class='acctEmail' alt='Envelope icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtEmailText() + "</h3>"; }
function getAcctMgmtPrintOTPText() { return "Printed One Time Passcodes"; }
function getAcctMgmtPrintOTPHdr() { return "<h2><img class='acctPrinter' alt='Printer icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtPrintOTPText() + "</h2>"; }
function getAcctMgmtYubiKeyText() { return "YubiKey Tokens"; }
function getAcctMgmtYubiKeyHdr() { return "<h2><img class='acctYubiKey' alt='Yubikey token icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtYubiKeyText() + "</h2>"; }
function getAcctMgmtHOTPTokenText() { return "HOTP Tokens"; }
function getAcctMgmtHOTPTokenHdr() { return "<h2><img class='acctHOTPToken' alt='Keyfob token icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtHOTPTokenText() + "</h2>"; }
function getAcctMgmtMobileAppText() { return "Mobile Authenticator"; }
function getAcctMgmtMobileAppHdr() { return "<h2><img class='acctMobileApp' alt='Smart phone icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtMobileAppText() + "</h2>"; }
function getAcctMgmtSavedUAText() { return "Remembered Browser Sessions"; }
function getAcctMgmtSavedUAHdr() { return "<h2><img class='acctUA' alt='Computer configuration icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtSavedUAText() + "</h2>"; }
function getAcctMgmtExtAuthText() { return "Pattern-based Authentication"; }
function getAcctMgmtExtAuthHdr() { return "<h2><img class='acctUA' alt='Computer configuration icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtExtAuthText() + "</h2>"; }
function getAcctMgmtVoiceText() { return "Voice Biometrics"; }
function getAcctMgmtVoiceHdr() { return "<h2><img class='acctVoiceBio' alt='Voice icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtVoiceText() + "</h2>"; }
function getAcctMgmtFIDOU2FText() { return "FIDO U2F Security Key"; }
function getAcctMgmtFIDOU2FHdr() { return "<h2><img class='acctSecurityKey' alt='Two factor token icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtFIDOU2FText() + "</h2>"; }
function getAcctMgmtWebAuthnText() { return "FIDO2 / Web Authentication"; }
function getAcctMgmtWebAuthnHdr() { return "<h2><img class='acctFingerprint' alt='Finger print icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtWebAuthnText() + "</h2>"; }
function getAcctMgmtWEBkeyText() { return "WEB-key"; }
function getAcctMgmtWEBkeyHdr() { return "<h2><img class='acctFingerprint' alt='Finger print icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtWEBkeyText() + "</h2>"; }
function getAcctMgmtBKMobileText() { return "BIO-key MobileAuth App"; }
function getAcctMgmtBKMobileHdr() { return "<h2><img class='acctMobileApp' alt='Smart phone icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtBKMobileText() + "</h2>"; }

function getAcctMgmtLastLogin() { return "<span class='activityLabel'>Last Login:</span>"; }
function getAcctMgmtLastChangePW() { return "<span class='activityLabel'>Last Password Change:</span>"; }
function getAcctMgmtLastResetPW() { return "<span class='activityLabel'>Last Password Reset:</span>"; }
function getAcctMgmtPWExpires() { return "<span class='activityLabel'>Password Expires On:</span>"; }
function getAcctMgmtExpDays(daysuntil) {
	var ret = " (";	/* Yes, a leading space */
	if (0 == daysuntil) {
		ret += boldRedSpan("Expired today") + ")";
	} else if (1 == daysuntil) {
		ret += boldRedSpan("Expires tomorrow") + ")";
	} else if (1 < daysuntil) {
		if (10 >= daysuntil)
			ret += boldRedSpan(daysuntil.toString() + " days") + " from today)";
		else
			ret += daysuntil.toString() + " days from today)";
	} else {
		ret += boldRedSpan("Expired " + (-daysuntil).toString() + " day(s) ago!") + ")";
	}
	return italicizeSpan(ret);
}
function getAcctMgmtChangePWUrlText() { return "Change your password now"; }

function getAcctMgmtLastStrikeLabel() { return "<span class='activityLabel'>Last Strike:</span> "; }
function getAcctMgmtStrikeCountLabel() { return "<span class='activityLabel'>Strike Count:</span> "; }
function getAcctMgmtStrikeSubsetLabel(num) { return "<span class='activityLabel'>(Last " + num + " records)</span><br />"; }
function getAcctMgmtStrikeTimeHeader() { return "<th>Date/Time</th>"; }
function getAcctMgmtStrikeIPHeader() { return "<th>IP Address</th>"; }
function getAcctMgmtStrikeUAHeader() { return "<th>Browser</th>"; }
function getAcctMgmtStrikeDetailsHeader() { return "<th>Strikes</th>"; }

function getAcctMgmtCQARequiredLabel() { return "<span class='activityLabel'>Required:</span> "; }
function getAcctMgmtCQARequiredData(thresh, numQs) { return "<span class='activityData'>Answer " + thresh + " of " + numQs + " questions</span>"; }
function getAcctMgmtCQAAnswers() { return "<span class='activityLabel'>Number Answered:</span> "; }
function getAcctMgmtEnrolledOn() { return "<span class='activityLabel'>Enrolled On:</span> "; }
function getAcctMgmtConfirmedOn() { return "<span class='activityLabel'>Confirmed On:</span> "; }
function getAcctMgmtChangeAnsLabel(bExist) { return (bExist ? "Change" : "Set") + " my challenge answers"; }
function getAcctMgmtClearAnsLabel() { return "Clear my challenge answers"; }
function getGetPWTitle() { return "Provide Current Password"; }
function getAcctMgmtPromptForPWMsg() { return "You must reconfirm your current password to perform this action. Please provide it in the field below to continue"; }
function getAcctMgmtClearCQAPrompt() { return "Are you sure you want to clear your challenge answers?\n\nYou may be asked to set them on next login."; }

function getAcctMgmtPhoneHeader() { return "<th>Phone</th>"; }
function getAcctMgmtEnrolledHeader() { return "<th>Enrolled</th>"; }
function getAcctMgmtPhoneType(ptype) { return "(" + (0 == ptype ? "landline" : "mobile") + ")"; }
function getAcctMgmtRemoveLabel() { return "Remove"; }
function getAcctMgmtRemovePhonePrompt(thenum) { return "Are you sure you want to remove phone " + thenum + "?"; }
function getAcctMgmtAddPhoneLabel() { return "Add new phone"; }

function getAcctMgmtEmailAddrLabel() { return "<span class='activityLabel'>Email Address:</span> "; }
function getAcctMgmtEmailActionLabel(bChange) { return (bChange ? "Change" : "Add") + " my email"; }

function getAcctMgmtLastPrintOTPLabel() { return "<span class='activityLabel'>Last Printed On:</span> "; }
function getAcctMgmtClearPrintOTPLabel() { return "Clear printed OTPs"; }
function getAcctMgmtPrintOTPLabel() { return "Print new OTPs"; }
function getAcctMgmtClearPrintOTPPrompt() { return "Are you sure you want to delete your previously printed OTPs?\n\nThis should be done if you misplaced the printout."; }

function getPrintOTPHdr() { return "<h1 style='color:#000'>Backup One Time Passcodes</h1>"; }
//function getPrintOTPFormattedOTP(otp) { return boldSpan(otp); }
function getPrintOTPFormattedOTP(otp) { return "<span class='bold printotpflex'>" + otp + "</span>"; }
function getPrintOTPInstr(otplen, pgurl, thetime) {
	var dsp = "<p id='smallFont'>Enter all " + otplen + " characters <strong>WITHOUT SPACES</strong> and cross off after use.</p>";
	dsp += "<p class='noprint'>Keep these codes some place safe like your wallet.<br />These passcodes can be erased or new ones can be generated at:<br /><a class='printlink' href=''>" + pgurl + "</a></p>";
	dsp += "<p class='noprint'><span class='activityLabel'>Generated Verification Passcodes on: </span><span class='activityData'>" + thetime + "</span></p>";
	return dsp;
}
function getPrintOTPButtonLabel() { return "Print One Time Passcodes"; }
function getPrintOTPReturnToAcctMgmtLabel() { return "&lt;&lt; Return to Account Management"; }

function getAcctMgmtYubiKeyNameHeader() { return "<th>Name</th>"; }
function getAcctMgmtYubiKeyIDHeader() { return "<th>ID</th>"; }
function getAcctMgmtLastUsedHeader() { return "<th>Last Used</th>"; }
function getAcctMgmtAddYubiKeyLabel() { return "Add new YubiKey Token"; }
function getAcctMgmtRemoveYubiKeyPrompt(thename) { return "Are you sure you want to remove YubiKey '" + thename + "'?"; }
function getYubiKeyEnrollTitle() { return "YubiKey Enrollment"; }
function getYubiKeyEnrollInstr() { return "Please enter a name/description for the YubiKey and an OTP from it in the fields below to enroll"; }
function getYubiKeyNameLabel() { return "Name/Description"; }
function getYubiKeyOTPLabel() { return "YubiKey OTP"; }

function getMobileAppTitle() { return "Mobile Authenticator Enrollment"; }
function getMobileAppInstr(idx, bFlag, bRequired, bSuppress, nSkips) { 
	if (0 == idx) {
		var ret = "<p>Please first download and install the " + boldRedSpan("Microsoft Authenticator") + ", " + boldRedSpan("Google Authenticator") + " or " + boldRedSpan("PortalGuard Password Reset") + " app from the appropriate app store for your phone.</p>";
		ret += "<p>When ready, please choose your phone type ";
		if (bFlag)	// Determines if description is user editable
			ret += "and enter a description ";
		ret += "to continue.";
		
		if (bRequired) {
			if (nSkips > 0) {
				ret += " You can skip this enrollment " + boldRedSpan(nSkips) + " more time" + pluralize(nSkips) + " before being forced to enroll.</p>";
			}
		} else {
			ret += " You can skip this enrollment but you will be asked to enroll again during your next login.</p>";
			if (bSuppress) {
				ret += "<p>To " + boldSpan("permanently") + " suppress reminders for this authentication type, check the box below before skipping. You can always enroll from the Account Management page.</p>";
			}
		}
		return ret;
	} else if (1 == idx) {
		if (bFlag)	// Determines if QR codes are supported
			return "1) Please use mobile app to scan the QR code below.";
		else
			return "1) Manually enter the secret below into Google Authenticator.";
	} else {
		return "2) Now enter the OTP it generates in the field below to finish enrollment."; 
	}
}

function getSuccessfulMobileAppLoginEnrollment() { return showSuccess("Mobile Auth Enabled Successfully", "<br /><a href='javascript:submitFromMobileApp()'>Continue logging in</a>"); }
function getMobileAppPhoneTypeLabel() { return "Phone Type"; }
function getMobileAppEntryDescLabel() { return "Entry Description"; }
function getAcctMgmtPhoneTypeLabel() { return "<span class='activityLabel'>Phone Type:</span> "; }
function getAcctMgmtMobileAppPhoneType(phonetype) {
	var content = "Unknown";
	if (1 == phonetype) { content = "iPhone"; }
	else if (2 == phonetype) { content = "Android"; }
	else if (3 == phonetype) { content = "BlackBerry"; } 
	else if (4 == phonetype) { content = "Windows"; }
	return italicizeSpan(content);
}
function getAcctMgmtMobileAppDescLabel() { return "<span class='activityLabel'>" + getMobileAppEntryDescLabel() + ":</span> "; }
function getAcctMgmtMobileAppDesc(inp) { return italicizeSpan(inp); }
function getAcctMgmtMobileAppHOTPCountLabel() { return "<span class='activityLabel'>Counter:</span> "; }
function formatMobileAppSecret(secret) {
	// Secret is 16 chars, insert a space after every 4th char
	return secret.substr(0, 4) + " " + secret.substr(4, 4) + " " + secret.substr(8, 4) + " " + secret.substr(12);
}
function getAcctMgmtMobileAppEnabledLabel() { return "<span class='activityLabel'>Enabled On:</span> "; }
function getAcctMgmtMobileAppLastUsedLabel() { return "<span class='activityLabel'>Last Used:</span> "; }
function getAcctMgmtDisableMobileAppLabel() { return "Disable mobile authenticator"; }
function getAcctMgmtEnableMobileAppLabel() { return "Enable mobile authenticator"; }
function getAcctMgmtDisableMobileAppPrompt() { return "Are you sure you want to disable the mobile authenticator?\n\nThis should be done if you lost your phone or need to enable a new one."; }

function getAcctMgmtDescHeader() { return "<th>Description</th>"; }
function getAcctMgmtIPHeader() { return "<th>IP Address</th>"; }
function getNoSavedUA() { return italicizeSpan("[No saved browser sessions]"); }
function getAcctMgmtClearAllSavedUAsLabel() { return "Clear All Remembered Browser Sessions"; }
function getAcctMgmtClearAllSavedUAsPrompt() { return "Are you sure you want to clear ALL remembered browser sessions?"; }
function getAcctMgmtClearSavedUAPrompt(desc) { return "Are you sure you want to clear this remembered browser session?\n\n    " + desc; }

function getAcctMgmtHOTPLabelHeader() { return "<th>Label</th>"; }
function getAcctMgmtHOTPCounterHeader() { return "<th>Counter</th>"; }
function getHOTPResyncLabel() { return "Re-sync Token Counter"; }
function getAcctMgmtNoHOTPTokensEnrolledMsg() { return italicizeSpan("[No tokens enrolled]"); }
function getHOTPResyncTitle() { return "Token Counter Resynchronization"; }
function getHOTPResyncInstr() { 
	var msg = "<p>This action will resynchronize the counter on your token with the server. ";
	msg += "It should only be done if OTPs from your token are " + boldSpan("not") + " being accepted.</p>";
	msg += "<p>Please generate and enter two consecutive OTPs from your token in the fields below to proceed.</p>";
	return msg;
}
function getFirstHOTPLabel() { return "First OTP Value"; }
function getSecondHOTPLabel() { return "Next OTP Value"; }
function getBadHOTPFormat() { return showError("", "A provided OTP is not the correct length"); }
function getBadSecondHOTPMsg() { return showError("Second OTP Incorrect", "You must enter two " + boldSpan("consecutive") + " OTPs from your token"); }
function getSuccessfulHOTPResyncMsg() {	return showSuccess("Token Resynchronization Successful", "<br/><a href='javascript:closeHOTPResync(true)'>Refresh the account management page</a>"); }

function getAcctMgmtDefLoginOTPLabel() { return "<span class='activityLabel'>Website Login</span>"; }
function getAcctMgmtDefChgPWOTPLabel() { return "<span class='activityLabel'>Password Change</span>"; }
function getAcctMgmtDefRADIUSOTPLabel() { return "<span class='activityLabel'>VPN/RADIUS</span>"; }
function getAcctMgmtDefDesktopOTPLabel() { return "<span class='activityLabel'>Desktop 2FA</span>"; }
function getAcctMgmtDefUnlockOTPLabel() { return "<span class='activityLabel'>Account Unlock</span>"; }
function getAcctMgmtDefResetOTPLabel() { return "<span class='activityLabel'>Password Reset</span>"; }
function getAcctMgmtDefRecoverOTPLabel() { return "<span class='activityLabel'>Password Recovery</span>"; }
// Authy Account Management
function getAcctMgmtAuthyEnabledLabel() { return "<span class='activityLabel'>Enabled On:</span> ";}
function getAcctMgmtAuthyLastUsedLabel() { return "<span class='activityLabel'>Last Used:</span> " }
function getAcctMgmtDisableAuthyAppLabel() { return "Disable Authy"; }
function getAcctMgmtEnableAuthyAppLabel() { return "Enable Authy"; }
function getAuthyEnrollTitle() { return "Authy Enrollment"; }
function getAcctMgmtAuthyText() { return "Authy"; }
function getAcctMgmtAuthyHdr() { return "<h2><img class='acctAuthy' alt='Authy icon' src='/_layouts/images/PG/images/clear.png'>" + getAcctMgmtAuthyText() + "</h2>"; }
function getAuthyInstr(idx) { 
	if (0 == idx) {
		var ret = "<p>Please first download and install the " + boldRedSpan("Authy") + " app from the appropriate app store for your phone.</p>";
		ret += "<p>Please enter your phone number, email address, and country below to enroll. A test OTP will be sent immediately for confirmation.</p>";		
		return ret;
	} else if (1 == idx) {
		var ret =  "<p>A One Time Passcode (OTP) was delivered to the "+ boldRedSpan("Authy") + " app.</p>";
		ret += "<p>Please enter the OTP below to continue.</p>";
		return ret;
	} 
}
function getAcctMgmtDisableAuthyPrompt() { return "Are you sure you want to delete this Authy account?"; }

function getOverriddenLabel() { return " (Overridden)"; }
function getAcctMgmtChangeDefOTP() { return "Change"; }
function getOTPDeliveryDesc(at) {
    if (AUTHTYPE_2FA_METHOD_PHONE == at) {
		return "Phone";
	} else if (AUTHTYPE_2FA_METHOD_EMAIL == at) {
		return "Email";
	} else if (AUTHTYPE_2FA_METHOD_YUBIKEY == at) {
		return "YubiKey";
	} else if (AUTHTYPE_2FA_METHOD_TTT == at) {
		return "PassiveKey";
	} else if (AUTHTYPE_2FA_METHOD_PRINTED == at) {
		return "Printed";
	} else if (AUTHTYPE_2FA_METHOD_HD == at) {
		return "Help Desk";
	} else if (AUTHTYPE_2FA_METHOD_MOBILE == at) {
		return "Mobile Authenticator";
	} else if (AUTHTYPE_2FA_METHOD_HOTP == at) {
		return "HOTP Token";
	} else if (AUTHTYPE_2FA_METHOD_RSA == at) {
		return "RSA SecurID";
	} else if (AUTHTYPE_2FA_METHOD_EXTAUTH == at) {
		return "Pattern-based Authentication";
	} else if (AUTHTYPE_2FA_METHOD_DUOPUSH == at) {
		return "Duo Push";
	} else if (AUTHTYPE_2FA_METHOD_VOICEBIO == at) {
		return "Voice Biometrics";
	} else if (AUTHTYPE_2FA_METHOD_FIDOU2F == at) {
		return "FIDO U2F Security Key";
	} else if (AUTHTYPE_2FA_METHOD_WEBAUTHN == at) {
		return "FIDO2 Webauthn Device";
    } else if (AUTHTYPE_2FA_METHOD_WEBKEY == at) {
		return "WEB-key Biometrics";
	} else if (AUTHTYPE_2FA_METHOD_DUOOTP == at) {
		return "Duo Token";
	} else if (AUTHTYPE_2FA_METHOD_BKMOBILE_PALM == at) {
		return "BIO-key MobileAuth App";
	} else if (AUTHTYPE_2FA_METHOD_AUTHY == at) {
		return "Authy";
	} else {
		return italicizeSpan("Unexpected OTP type");
	}
}
function getChangeDefOTPTitle() { return "Change Default OTP Method"; }
function getChangeDefOTPInstr(act) { 
	var ret = "Please choose the default One Time Passcode (OTP) method for ";
	if (PG_2FAUTH_ACTION_LOGIN == act) {
		ret += boldRedSpan("website login");
	} else if (PG_2FAUTH_ACTION_CHANGEPW == act) {
		ret += boldRedSpan("password changes");
	} else if (PG_2FAUTH_ACTION_RADIUS == act) {
		ret += boldRedSpan("VPN/RADIUS access");
	} else if (PG_2FAUTH_ACTION_DESKTOP == act) {
		ret += boldRedSpan("Desktop Two-Factor Authentication");
	} else if (PG_OTPMETH_ACTION_UNLOCK == act) {
		ret += boldRedSpan("Self Service Account Unlock");
	} else if (PG_OTPMETH_ACTION_RESET == act) {
		ret += boldRedSpan("Self Service Forgotten Password Reset");
	} else if (PG_OTPMETH_ACTION_RECOVER == act) {
		ret += boldRedSpan("Self Service Password Recovery/Display");
	}
	ret += ".";
	return ret;
}
function getChangeDefOTPLabel() { return "OTP Method"; }

function getOptIn2FALabel() { return "Enable Multi-Factor Login"; }
function getAcctMgmtOptIn2FALabel() { return "<span class='activityLabel'>Multi-Factor Enabled On:</span> "; }
function getAcctMgmtOptIn2FALink() { return "Enable Multi-Factor for my account"; }
function getAcctMgmtOptIn2FAEnrollRequired(defotp) { return showWarning("", "You must enroll the default OTP method (currently " + boldRedSpan(getOTPDeliveryDesc(defotp)) + ") before opting in for 2FA.<br /><br />You could also change the default 'Website Login' OTP method in the <a href=\"javascript:showAccordion('collapse5')\">'OTP Delivery Methods' section</a> once your preferred OTP method is enrolled."); }
function getAcctMgmtOptOut2FALink() { return "Disable Multi-Factor for my account"; }
function getAcctMgmtOptIn2FAPrompt() { 
	var ret = "Are you sure you want to enable Multi-Factor authentication for your account?";
	ret += "\n\nIt is much more secure and you will be prompted to login to this website with a username, password and One Time Passcode (OTP).";
	return ret;
}
function getAcctMgmtOptOut2FAPrompt() { 
	var ret = "Are you sure you want to disable Multi-Factor authentication for your account?";
	ret += "\n\nLeaving it enabled is more secure and helps prevent access by unauthorized users."; 
	return ret;
}

// For 2FA OTP prompts
function getInstrEnterPrintOTP() { return "Please enter a One Time Passcode (OTP) from your printed sheet of OTPs to continue." }
function getHelpDeskOTPPrompt() { return "Contact Help Desk " + hdContact; }
function getInstrEnterHDOTP() { return "Please contact the Help Desk to receive a One Time Passcode (OTP). " + hdContact + "Enter the OTP below to continue." }
function getInstrEnterYubiKeyOTP() { return "Please enter a One Time Passcode (OTP) from your YubiKey token to continue." }
function getInstrEnterMobileAppOTP() { return "Please enter a One Time Passcode (OTP) from your mobile authenticator to continue." }
function getInstrTTTEnrollNeeded() { return showWarning("Missing/Unconfigured Browser Toolbar", "<p>Your account is configured to login with a browser toolbar that is either not installed for this browser or not yet configured.</p><p>Please contact the Help Desk to receive a One Time Passcode (OTP) to continue logging in.</p>"); }
function getInstrEnterHOTP() { return "Please enter a One Time Passcode (OTP) from your HOTP token to continue." }
function getInstrEnterRSAPasscode() { return "Please enter a passcode from your RSA SecurID token to continue." }
function getInstrEnterExtAuth() { return "Please enter your authentication pattern to continue." }
function getInstrEnterDuoOTP() { return "Please enter a One Time Passcode (OTP) from your Duo token to continue." }

function getExceptionMsg(msg) { return showError("", msg); }

function getBtnLogin() { return "Login"; }
function getBtnContinue() { return "Continue"; }
function getBtnCancel() { return "Cancel"; }
function getBtnSetPassword() { return "Set Password"; }
function getBtnForgotPassword() { return "Forgot Password?"; }
function getBtnPrevious() { return "&lt;&lt; Previous"; }
function getBtnNext() { return "Next &gt;&gt;"; }
function getBtnAccept() { return "Accept"; }
function getBtnDecline() { return "Decline"; }
function getBtnSkip() { return "Skip"; }
function getBtnFIDO2PWLess() { return "Login Passwordless!"; }

function getCQTopOptionText() { return "-- Please choose a question --"; }
function translateQuestionText(idx, enText) {
	if (null != arrLangsAvailable && arrLangsAvailable.length > 0) {
		// Change this list of English question text and the corresponding translation for this language.
		// The list below should include all optional and mandatory challenge questions from ALL PortalGuard Security Policies since this function is utilized for this entire PG server
		//	This JavaScript will automatically swap the English text on the left side to the appropriate translation for the target language
		//	NOTE: Each question *MUST* be contained in square brackets as shown in the example below.
		arrQs = [
			// Edit each entry below
			["Question 1 in English", "Question 1 in target language"],
			["Question 2 in English", "Question 2 in target language"],
			["Question 3 in English", "Question 3 in target language"],
			
		// ** Do NOT edit below this line **
		["",""] ];
		
		for (var i = 0; i < arrQs.length; i++) {
			if (enText.toUpperCase() === arrQs[i][0].toUpperCase()) {
				return idx + ") " + arrQs[i][1];
			}
		}
	}

	// Default to returning the english text if we didn't find a match -OR- multi-language is disabled
	return idx + ") " + enText;
}

function getExpiredPwMsg(expdays, gracedays) {
	if (gracedays <= 0) {
		return showError("Password Expired", "Your password has expired and you must reset it.");
	} else {
		/* 2017-02-23 - Using a mix of block elements to get spacing right */
		var ret = "<p>You have " + boldRedSpan(gracedays) + " day" + pluralize(gracedays) + " to reset your password. Your account will be " + boldSpan("locked out") + " if you do not.</p>";
		ret += "<div>Fill out the form below and submit to change your password.</div>";
		ret += "<br /><a href='javascript:submitLoginFromPopup()'>Continue without changing your password</a>";
		return showWarning("Password Expired", ret);
	}
}

function getInvalidUserMsg() {
	return showError("", "Invalid username provided");	
	//return showError("", "Invalid username provided<br /><br />New user? <a href='register.aspx'>Create a new account here!</a>");
	//return showError("", "Invalid username provided<br /><br />Forgot your username? <a href='/_layouts/PG/forgotuser.aspx?ReturnUrl=" + encodeURIComponent(getQSVar('ReturnUrl')) + "'>Click here to find your username.</a></div>");
}

function getMultipleUsersMsg() { return showError("", "Multiple matches found for provided username"); }
function getAccoutDisabledMsg() { return showError("", "This account is marked as " + boldSpan("disabled") + " in the user repository"); }
function getAccountExpiredMsg() { return showError("", "This account is marked as " + boldSpan("expired") + " in the user repository"); }
function getPWChangeDisabledMsg() { return showError("", "Password changes for this account are " + boldSpan("disabled") + " in the user repository"); }	
function getInvalidPwMsg() { return showError("", "Incorrect password provided"); }
function getBadLoginMsg() { return showError("", "Invalid username or password - please try again"); }
function getPasswordUnavailableMsg() { return showWarning("Password Reset Required", "Login is not possible with this account's current password. The password must be reset before login can occur. This can be done through self-service or by the Help Desk."); }

function getStrikeoutMsg(strikes, strikesleft, expSecs) {
	if (strikesleft <= 0){
		var ret = "<div>Maximum unsuccessful login attempts reached.</div>";
		if (!strikes && !strikesleft && !expSecs) {
			// Don't add anything
		} else if (expSecs != -1) {
			var	partmin = "";
			var	dispMins = (expSecs/60) | 0;	// Casts back to int
			if (dispMins == 0) {
				partmin = "less than ";
				dispMins = 1;
			}
			ret += "<br /><div>Your account will be automatically unlocked and you can try again in " + partmin + boldGreenSpan(dispMins) + " minute" + pluralize(dispMins) + ".</div>";
		}

		// 2013-05-02 - Optionally hide the password field and associated controls
		if (g_bHidePWFieldOnLockout) {
			if (PG_AUTHTYPE_LOGIN == AUTHTYPE) {
				setElemVisibility(['fldStaticPWLogin'], false);
			} else if (PG_AUTHTYPE_SETPW == AUTHTYPE){
				setElemVisibility(['fldsSetPWCurPW'], false);	
			}
		}
		return showError("Account Locked", ret);
	} else {
        if (isLanyardLogin()) {
			setTimeout(function() { setElemContent("", ["ErrMsgLogin"]); frameCap(); }, PG_LL_RELOGIN_TIME);
			return getLanyardLoginNotAllowedMsg();
		} else {
			var ret = "<div>Your account currently has " + boldRedSpan(strikes) + " strike" + pluralize(strikes) + ".</div>";
			ret += "<div>It will be " + boldSpan("locked") + " when you reach " + (strikes+strikesleft) + " strike" + pluralize(strikes+strikesleft) + ".</div>"
			ret += "<br /><div><a href='javascript:showSSPopup()'>Click here to reset your forgotten password</a></div>";
			return showWarning("Authentication Failed", ret);
		}
	}
}

function getServerDownMsg() { return showError("", "Unable to reach the authentication server - please contact the administrator"); }
function getUnsupportedMsg() { return showError("", "Requested feature or function is not available - please contact the administrator"); }
function getGenEmailErrorMsg() { return showError("", "An unexpected email failure occurred - please contact the administrator"); }
function getLDAPUnwillingToPerformMsg() { return showError("", "Your password cannot contain your username, first name or last name. Please try again."); }
function getDBConnectErrorMsg() { return showError("", "Unable to connect to the back-end SQL database - please contact the administrator"); }
function getLDAPStrongAuthRequiredMsg() { return showError("Directory Connection Failed", "Unable to connect to the back-end LDAP directory (strong auth required)<br />Only an administrator can resolve this issue"); }
function getIDEngUnknownError() { return showError("", "An unknown identity engine failure occurred - please contact the administrator"); }
function getRBAUnsupportedError() { return showError("", "Your machine is not capable of performing risk-based authentication - please contact the administrator"); }
function getConfigErrorMsg() { return showError("", "The security policy is incorrectly configured - please contact the administrator"); }
function getInternalErrorMsg() { return showError("Internal Error Occurred", "An internal server error occurred." + msg_CONTACT_HD); }
function getBadRequestMsg() { return showError("Bad Request Type", "Please refresh this browser page to re-try your request." + msg_CONTACT_HD); }
function getDocumentNotSavedMsg() { return showError("Profile Not Saved", "Your profile could not be updated." + msg_CONTACT_HD); }
function getLicenseExpiredMsg() { return showError("License Expired", "Your <span class='italicsEmphasis'>PortalGuard</span> license has expired or the license key is invalid."); }
function getUnlicensedMsg() { return showError("Unlicensed Feature", "Your <span class='italicsEmphasis'>PortalGuard</span> license does not permit this action."); }
function getSessionPreventedMsg(SessionLimit) { return showError("Login Session Prevented", "You already have an active login session<br /><br />You must logout of the other session or contact the <span class='italicsEmphasis'>Help Desk</span>"); }

function getSuccessfulPWChangeMsg(bSubmit, root, bTOU) {
	var linkstatus = getLinkResults(root);
	var msg = "";
	if (linkstatus.length > 0)
		msg += linkstatus;
		
	if (bStandAlonePWChange) {
		// 2013-08-14 - This function is only available on changepw.aspx!
		msg += "<br /><a href='javascript:leavePWChange()'>Return to the Account Management page</a>";
	} else {
		if (bTOU) {
			msg += "<br /><a href='javascript:showTOUPopup()'>Please read and accept the Terms Of Use</a>";
		} else {
			msg += "<br /><a href='javascript:" + (bSubmit ? "closeSetPW(true)" : "closePopup(\"popup_SetPW\", false, " + (g_bPGClient || g_bSideCar ? "true": "false") + ", PG_AUTHTYPE_LOGIN)") + "'>Continue logging in</a>";
		}
	}
	/* 2017-03-02 - For spacing on changepw.aspx on sm devices */
	if (bStandAlonePWChange) {
		try {
			document.getElementById("ErrMsgSetPW").setAttribute("style", "padding-bottom: 5px;");
		} catch (e) { alert("Exception - " + e); }
	}
	return showSuccess("Password Successfully Set", msg);
}

function getCustomTOUTitle() { return "Terms Of Use"; }
function getCustomTOUMsg() {
	var ret = "<div>" + boldSpan("Terms & Conditions") + "</div>";
	ret += "<p>Unlawful use of company resources is strictly prohibited</p>";
	ret += "<p>By logging into this site, you agree to these terms and conditions.</p><hr><p>Click 'Accept' to close this window and continue logging in.</p>"
	return ret;
}

function getPWComplexityHdr(grp_floor, bPreemptive) {
	var msg = "";
	/* 2017-02-23 - Do NOT use generic "show" funcs because this only builds the beginning of the response */
	if (bPreemptive)
		msg = "<div class='warningdiv'><div class='pgh3'>Password Complexity Rules</div>";
	else
		msg = "<div class='errordiv'><div class='pgh3'>New Password Insufficiently Complex</div>";
	
	if (grp_floor > 0)
		msg += "Your new password must " + boldRedSpan("always") + " satisfy the following rules:<ul>";
	else
		msg += "Your new password must satisfy the following rules:<ul>";
	return msg;
}

function getPWComplexityMid(grp_floor) {
	if (grp_floor > 0)
		return "</ul>It must also satisfy any " + boldRedSpan(grp_floor) + " of the rules:<ul>";
	return "";
}

function getPWComplexityServerSide(root) {
	try {
		// The "master" setting about whether to show any server-side rules
		if (!g_bShowServerSidePWRules)
			return "";
	
		// 2019-02-18 - Besides AD complexity, currently up to 5 other Server Side (SS) rules to display
		var root_pwqual = getXMLChildElement(root, "pwquality");
		var msg = "";	// Blank by default so we don't show just the header if no rules are enabled
		if (null != root_pwqual) {
			var root_hist = getXMLChildElement(root_pwqual, "pwhistory");
			var root_dict = getXMLChildElement(root_pwqual, "pwdictionary");
			var root_diffchars = getXMLChildElement(root_pwqual, "pw_diffchars");
			var root_regex = getXMLChildElement(root_pwqual, "pwregex");
			var root_minage = getXMLChildElement(root, "pw_minage");	/* This rule is a sibling of <pwquality> */
		
			// Header above the SS rules
			var hdr = "<li>The following rules are verified when you submit your new password:<ul>";
			
			// 1) PW History
			if (null != root_hist) {
				var histlen = getXMLAttrNum(root_hist, "rule");
				msg += getPWHistoryMsg(histlen);				
			}
			
			// 2) Dictionary
			if (null != root_dict) {
				var numterms = getXMLAttrNum(root_dict, "rule");
				msg += getPWDictionaryMsg(numterms);
			}
			
			// 3) Similar passwords
			if (null != root_diffchars) {
				var numterms = getXMLAttrNum(root_diffchars, "rule");
				msg += getPWSimilarityMsg(numterms);
			}
			
			// 4) Regular expression
			if (null != root_regex) {
				// RegEx could be anything so this is the "failure" message from the secpol
				var regexmsg = getXMLElementStr(root_pwqual, "pwregex");
				msg += getPWRegExMsg(regexmsg);
			}
			
			// 5) Minimum age
			if (null != root_minage) {
				var mins = getXMLElementNum(root, "pw_minage");
				msg += getPWMinAgeMsg(mins);
			}
		
			// Check to ensure we actual have at least one rule to display
			if (msg.length > 0) {
				msg = hdr + msg + "</ul></li>";
			}
		}
		return msg;
	} catch (e) {
		console.log(formatException("getPWComplexityServerSide()", e));
	}
	
	return "";	// No message by default
}

function getPWComplexityFtr(grp_floor) {
	return "</ul></div>";
}

function getPreemptivePWQualityMsg(root, root_pwauth) {
	var msg = "", msg2 = "";
	
	// 2011-10-31 - Is rule grouping enabled?
	var root_grp = getXMLChildElement(getXMLChildElement(root, "pwquality"), "pwgroup");
	var grp_floor = getXMLAttrNum(root_grp, "rule");
	var msg_hdr = getPWComplexityHdr(grp_floor, true);
	var msg_mid = getPWComplexityMid(grp_floor);
	var msg_ftr = getPWComplexityServerSide(root) + getPWComplexityFtr(grp_floor);	// 2019-02-18 - Server side rule support
	
	// 2016-12-20 - Ignoring g_bShowAllPWRules variable here since they need to see all rules
	var root_rule = getXMLChildElement(root, "pwquality");
	// Need to get child element and determine if the rule was met or not
	var kids = root_rule.childNodes;
	for (i = 0; i < kids.length; i++) {
		var	bGrouped = new wrapbool();
		var tmp = getSinglePWRuleMsg(root_rule, 0, kids[i].nodeName, bGrouped, true, true);
		if (bGrouped.value)
			msg2 = msg2 + tmp;
		else
			msg = msg + tmp;
	}
	
	if (g_bInlineIISIllegalCharsPWRule) {
		msg = msg + getIISIllegalCharsMsg();
	}
	
	if (msg_hdr.length > 0 || msg_ftr.length > 0)
		msg = msg_hdr + msg + msg_mid + msg2 + msg_ftr;
		
	return msg;
}

function getMinimumPasswordSettingMsg(arg) { return "<li id='minLenRule'>At least " + boldRedSpan(arg) + " character" + pluralize(arg) + " long</li>"; }
function getMaximumPasswordSettingMsg(arg) { return "<li id='maxLenRule'> Be " + boldRedSpan(arg) + " or fewer character" + pluralize(arg) + " long</li>"; }
function getMinimumLowercasePasswordSettingMsg(arg) { return "<li id='minLowerRule'>At least " + boldRedSpan(arg) + " lowercase character"  + pluralize(arg) + "</li>"; }
function getMinimumUppercasePasswordSettingMsg(arg) { return "<li id='minUpperRule'>At least " + boldRedSpan(arg) + " uppercase character" + pluralize(arg) + "</li>"; }
function getMinimumNumericPasswordSettingMsg(arg) { return "<li id='minNumericRule'>At least " + boldRedSpan(arg) + " numeric character" + pluralize(arg) + "</li>"; }
function getMinimumSpecialCharsPasswordSettingMsg(arg) { return "<li id='minSpecialRule'>At least " + boldRedSpan(arg) + " special character" + pluralize(arg) + "</li>"; }
function getMinimumPWScorePasswordSettingMsg(arg) { return "<li>Have a minimum password score index of " + boldRedSpan(arg) + "</li>"; }
function getPWHistoryMsg(histlen) { return "<li>Not match your last " + boldRedSpan(histlen) + " password" + pluralize(histlen) + "</li>"; }
function getPWDictionaryMsg(numterms) {
	// Can display different messages based on how many words are present in the dictionary
	if (1 == numterms) {
		return "<li>Must not contain the word in the dictionary</li>";
	} else if (numterms > 1) {
		return "<li>Must not contain any of the words in the dictionary</li>";
	} else {
		return "";	// No terms...
	}
}
function getPWSimilarityMsg(mindiff) { return "<li>Contain at least " + boldRedSpan(mindiff) + " different chars from previous password</li>"; }
function getPWMinAgeMsg(mins) { return "<li>Your current password must not have been changed within the last " + boldRedSpan(mins/1440) + " day" + pluralize(mins/1440) + "</li>"; }
function getPWRegExMsg(arg) {
	// The argument is the regex failure message which *should* be HTML. Default impl is parsing it out
	var msg = strRight(strLeft(arg, "</div>"), "errordiv'>");
	if (msg.length > 0) { 
		return "<li>" + msg + "</li>"; 
	} else {
		// Problem parsing it the failure message
		return "";
	}
}

function getADPWComplexityMsg(minlen, loginname, dspname) {
	//var msg = "<li>Must pass Active Directory strength policy</li><ul type='square'>";
	var msg = "";
	msg += "<li id='adpwminlen'>At least " + boldRedSpan(minlen) + " characters long</li>";
	msg += "<li id='adpwnouser'>Not contain any parts of your name</li>";
	msg += "<li id='adpwcats'>Contain characters from " + boldRedSpan("3") + " of the following categories:";
	msg += "<ol><li id='adpwupper'>Uppercase characters (A - Z)</li>";
	msg += "<li id='adpwlower'>Lowercase characters (a - z)</li>";
	msg += "<li id='adpwnumeric'>Base 10 digits (0 - 9)</li>";
	msg += "<li id='adpwspecial'>Non-alphanumeric (e.g. !, $, @)</li>";
	msg += "</ol>";
	//msg += "</li></ul>";
	return msg;
}

function getIISIllegalCharsMsg() { return "<li id='iisRule'>Not contain the " + boldRedSpan("<") + " char OR " + boldRedSpan("&#")+ "</li>"; }

function getPWRuleMetMsg(msg) { return strInsertBefore(msg, "</li>", "<span class='pwruleok'> (OK)</span>"); }
function getPWRuleUnmetMsg(msg) { return strInsertBefore(msg, "</li>", "<span class='pwrulebad'> (Failed)</span>"); }
function getPreviousPasswordMsg() { return showError("Password Cannot Be Reused", "Your new password cannot match previously used passwords"); }
function getNoDictionaryWordsMsg() { return showError("Password Contains Dictionary Word", "Your new password contained a dictionary or blacklisted word"); }

function getPWMinimumDiffCharsMsg(mindiff) {
	if (mindiff > 0)
		return showError("New Password Too Similar", "Your new password must contain at least " + boldRedSpan(mindiff) + " different characters from previous password");
	return "";
}

function getPWTooYoungMsg(minsleft) {
	if (minsleft > 0) {
		var ret = "Your password cannot be changed because it is not old enough<br />You must wait another ";
		var theamt = minsleft;
		var theunit = " minute";
		if (theamt > 1440) {
			theamt = (theamt/1440) | 0;	// Casts back to int
			theunit = " day";
		} else if (theamt > 60) {
			theamt = (theamt/60) | 0;	// Casts back to int
			theunit = " hour";
		}		
		ret += theamt + theunit + pluralize(theamt);
		return showError("Password Cannot Be Changed", ret);
	}
	return "";
}

function getRepeatedAnswerMsg() { return showError("Answer Repetition Not Allowed", "You cannot provide the same answer to multiple questions"); }
function getAnswerIsQuestionWordMsg() { return showError("Answer Contained In Question Text", "You cannot provide an answer that is contained in the text of the question"); }					
function getNoDefaultLockoutDateMsg() { return showError("Inactivity Configuration Problem", "User has not logged in and 'inactivity default date' not set in policy." + msg_CONTACT_HD); }
function getInactivityLockoutDaysMsg(days) { return showError("Inactivity Lockout", "User account has been locked due to inactivity of more than " + days + " day" +  pluralize(days)); }

function getAnswerInsufficientlyComplexMsg(arg) {
	var msg = "Your answers must be at least " + boldRedSpan(arg) + " character" + pluralize(arg) + " long and cannot be a repeated character";
	msg += "<br /><br />Do " + boldSpan("not") + " provide answers comprised of too many symbols as they may not be counted as valid characters";
	return showError("Answer Insufficiently Complex", msg);
}

function getBlankSetAnsProvidedMsg(numMandQs, numOptQs, numShares) {
	var msg = "Please answer ";
	if (numMandQs > 2)
		msg += boldSpan("all " + numMandQs) + " of the " + italicizeSpan("mandatory") + " questions below";
	else if (numMandQs == 2)
		msg += boldSpan("both") + " " + italicizeSpan("mandatory") + " questions below";
	else if (numMandQs == 1)
		msg += "the " + italicizeSpan("mandatory") + " question below";
	
	if (numShares > 0) {
		if (numMandQs > 0)
			msg += " " + italicizeSpan("AND") + " ";
		msg += "at least " + numShares + " of the " + numOptQs + " optional questions below";
	}
	msg += "<br /><br />Do " + boldSpan("not") + " provide answers comprised of too many symbols as they may not be counted as valid characters";
	return showError("Blank Answer", msg);
}

function getBlankResetAnsProvidedMsg(numMandQs, numShares, numThresh) {
	var msg = "Please answer ";
	if (numMandQs > 2)
		msg += boldSpan("all " + numMandQs) + " of the " + italicizeSpan("mandatory") + " questions below";
	else if (numMandQs == 2)
		msg += boldSpan("both") + " " + italicizeSpan("mandatory") + " questions below";
	else if (numMandQs == 1)
		msg += "the " + italicizeSpan("mandatory") + " question below";
	
	if (numShares > 0) {
		if (numMandQs > 0)
			msg += " " + italicizeSpan("mandatory") + " ";
		msg += "any " + numThresh + " of the " + numShares + " optional questions below";
	}
	return showError("Blank Answer", msg);	
}

function getWrongRecoverAnswerProvidedMsg(strikes, strikesleft, expSecs) {
	if (strikes > 0) {
		if (strikesleft <= 0) {
			var ret = "Maximum unsuccessful login attempts reached.<br />";
			if (expSecs != -1) {
				var	partmin = "";
				var	dispMins = (expSecs/60) | 0;	// Casts back to int
				if (dispMins == 0) {
					partmin = "less than ";
					dispMins = 1;
				}
				ret += "<br />Or, try to log in again in " + partmin + boldGreenSpan(dispMins) + " minute" + pluralize(dispMins) + " with the correct password";
			}		
			return showError("Incorrect Answer - Account Locked", ret);
		} else {
			var ret = "Your account currently has " + boldRedSpan(strikes) + " strike" + pluralize(strikes) + ".";
			ret += "<br /><br />It will be " + boldSpan("locked") + " when you reach " + (strikes+strikesleft) + " strike"  + pluralize(strikes+strikesleft) + ".";
			return showWarning("Incorrect Answer", ret);
		}
	} else {
		return showWarning("Incorrect Answer", "You provided an incorrect answer, please try again");
	}
}

function getNoRecoveryQuestionsSetMsg(bFromPGClient) {
	var ret = "Your password recovery answers are not set yet.<br /><br />";
	if (bFromPGClient)
		ret += "You cannot recover your password at this time.";
	else
		ret += "Fill out the form below to set your recovery answers.";
	return showError("Challenge Recovery Answers Not Set", ret);
}

function getOfflineRecoveryMsg(thepw) {
	var ret = "<br />Your current password is: " + boldRedSpan(thepw) + "<br /><br /><a href='javascript:closePGClient()' >Close this window and login to your workstation</a>";
	return showSuccess("Password Successfully Recovered", ret);
}

function getMissingERBMsg(bOffline) {
	var ret = "Your information for password recovery is missing or needs to be updated.<br /><br />";
	if (bOffline)
		ret += "You will not be able to recover your password until you reconnect to the corporate network.";
	else
		ret += "Fill out the form below to reset your recovery answers.";
	return showError("Password Recovery Information Stale", ret);
}

function getInvalidERBMsg(bOffline) {
	var ret = "Your information for offline password recovery could not be validated.<br /><br />";
	if (bOffline)
		ret += "You will not be able to recovery your password until you reconnect to the corporate network.";
	else
		ret += "Fill out the form below to reset your recovery answers.";
	return showError("Offline Recovery Information Invalid", ret);
}

function getLockedERBMsg() {
	var ret = "Your password recovery information has been deleted as a security precaution.<br /><br />";
	ret += "You will need to contact the help desk to restore your access.<br /><br /><a href='javascript:closePGClient()'>Close this window</a>";
	return showError("Password Recovery Unavailable", ret);
}

function getGenErrorMsg(errcode) {
	var ret = "A general failure occurred - please contact the administrator";
	if (errcode)
		ret += "<br /><br />Error code: " + boldRedSpan(errcode);
	return showError("", ret);
}

function getMandCQAInstructions(numQs) {
	if (numQs > 2)
		return "Please answer ALL " + numQs + " of the mandatory questions below";
	else if (numQs == 2)
		return "Please answer BOTH mandatory questions below";
	else
		return "Please answer the mandatory question below";
}

function getSetCQAOptInstructions(numQs, numShares) { return "Please answer at least " + numShares + " of the " + numQs + " questions below.<br />NOTE: Answers must be at least " + boldRedSpan(ANSWER_MIN_LEN) + " characters long."; }
function getUseCQAOptInstructions(numShares, numThresh) { return "Please answer any " + numThresh + " of the " + numShares + " questions below"; }
function getDDQuestionsNoChoiceMsg() { return "Please choose a question from the list"; }
function getDDQuestionsDupeChoiceMsg(q, r) { return "The same question was chosen for answers " + q + " and " + r + "\nPlease ensure each question is only chosen once"; }

function getRemainingAnsCount(reqMand, countMand, reqOpt, countOpt) {
	var ret = "";
	if (reqMand > 0) {
		var rem = reqMand - countMand;
		if (rem > 0)
			ret = rem + " mandatory";
	}
	
	if (reqOpt > 0) {
		var rem = reqOpt - countOpt;
		if (rem > 0) {
			if (ret.length > 0)
				ret += ", ";
			ret += rem + " optional";
		}			
	}
	return ret;
}

function getBadUserDataMsg() { return showError("Bad or Missing User Data", "Could not complete the request due to bad or missing user data." + msg_CONTACT_HD); }
function getBadAdminMsg() { return showError("", "The repository admin credentials are invalid or insufficient - please contact the administrator"); }
function getBadPhoneMsg(fmt) { return showError("Invalid Phone Number", "Please enter a phone number in the following format:<div class='confDsp'>" + fmt + "</div>"); }
function getNoPhoneFoundMsg() { return showError("Missing Phone Number", "Could not find a phone number on record for this account"); }
function getBadPhoneProviderMsg() { return showError("", "Please choose a phone provider from the given list"); }
function getDuplicatePhoneMsg() { return showError("Duplicate Phone Number", "You have already enrolled this phone number - please enter a different one"); }

function getOTPEnrollInstr(thetype) {
	var ret = "You must login using One Time Passcodes (OTP)";
	if (AUTHTYPE_2FA_METHOD_PHONE == thetype) {
		ret += " sent to your phone.<br /><br />Please enter your current password and phone number";
	} else if (AUTHTYPE_2FA_METHOD_EMAIL == thetype) {
		ret += " sent to your email.<br /><br />Please enter your current password and email address";
	} else {
		ret += ".<br /><br />Please enter your current password and information";
	}
	ret += " to enroll. A test OTP will be sent immediately for confirmation.";
	return ret;
}

function getAcctEnrollInstr(thetype) {
	var typedesc = (1 == thetype ? "phone number" : "email address");
	return "Please enter your " + typedesc + " below to enroll. A test OTP will be sent immediately for confirmation.";
}

function getOTPEntryInstr(delivery, conf) {
	var ret = "A One Time Passcode (OTP) will be delivered as a";
	if (PG_OTP_DELIVERY_SMS	== delivery) {
		ret += " text/SMS";
	} else if (PG_OTP_DELIVERY_VOICE == delivery) {
		ret += " phone call";
	} else {
		ret += "n email";
	}

	if (conf && conf.length > 0)
		ret += " to:<div class='confDsp'>" + conf + "</div><br />";
	else
		ret += ". ";
		
	ret += "It could take 10 to 15 seconds to be delivered. Upon receipt, please enter the OTP below to continue."
	return ret;
}

function getMissingOTPMsg() { return showError("", "Please enter OTP below"); }
function getBadEmailFormatMsg() { return showError("Invalid Email Address Format", "Please provide a correctly formatted email address, e.g.: username@domain.com"); }
function getBlockedEmailDomainMsg() { return showError("Email Domain Cannot Be Used", "The domain for the provided email address is not allowable. Please enroll a different email address."); }
function getEmailUnavailableMsg() { return showError("Duplicate Email Address", "This email address is already in use - please enter a different one to continue"); }

function getBadOTPMsg(strikes, strikesleft, expSecs) {
	if (0 == strikes && 0 == strikesleft && 0 == expSecs) {
		return showError("", "Incorrect One Time Passcode provided");
	} else if (strikesleft <= 0) {
		var ret = "Maximum unsuccessful login attempts reached.<br />";
		if (expSecs != -1) {
			var	partmin = "";
			var	dispMins = (expSecs/60) | 0;	// Casts back to int
			if (dispMins == 0) {
				partmin = "less than ";
				dispMins = 1;
			}
			ret += "<br />Your account will be automatically unlocked and you can try again in " + partmin + boldGreenSpan(dispMins) + " minute" + pluralize(dispMins);
		}
		return showError("Account Locked", ret);
	} else {
		var ret = "Your account currently has " + boldRedSpan(strikes) + " strike" + pluralize(strikes) + ".";
		ret += "<br /><br />It will be " + boldSpan("locked") + " when you reach " + (strikes+strikesleft) + " strike" + pluralize(strikes+strikesleft) + ".";
		return showWarning("Authentication Failed", ret);
	}
}

function getExpiredOTPMsg() {
	var ret = "The One Time Passcode you entered has expired";
	if (PG_AUTHTYPE_SS == AUTHTYPE) {
		ret += ". This dialog will automatically close in 10 seconds and you will need to restart the self-service action.";
		setTimeout(function() { window.location.reload(); }, 10000);
	} else if (PG_AUTHTYPE_MOBILEAPP_ENROLL == AUTHTYPE) {
		ret += " - please enter the newly generated OTP and resubmit.";
	} else {
		ret += " - please click the 'Cancel' button to return to the login page. Clicking the 'Continue' button on the login page will send another OTP.";
	}
	return showError("OTP Expired", ret);
}

function getOTPNotSentMsg() { return showError("OTP Delivery Error", "The OTP for your account could not be sent due to a server error." + msg_CONTACT_HD); }
function getLoginBlockedMsg() { return showError("Login Blocked", "It has been determined that login from the current device is not permitted with your account." + msg_CONTACT_HD); }

function getLoginInstr(bStandard) {
	if (bStandard)
		return "";	// No default instructions!
	else
		return "Please provide your username below then click the 'Continue' button";
}

function getChangeUsernameTitle() { return "Change Username"; }
function getChangeUsernameInstr(bAsEmail, bOTPVerify) {
	if (bAsEmail) {
		var ret = "Please provide your personal email address below - it will be used as your username going forward.";
		if (bOTPVerify)
			ret += "<br /><br />A One Time Passcode will be sent to it which you must enter to complete the process.";
		return ret;
	} else {
		return "Please provide your choice for a new username below.";
	}
}

function getConfirmEmailTitle() { return "Confirm Email Address"; }
function getConfirmEmailInstr(email, bRequired) {
	var ret = "An email with a One Time Passcode (OTP) has just been sent";
	if (email && email.length > 0) {
		ret += " to:<div class='confDsp'>" + email + "</div><br />";
	} else {
		ret += ".";
	}
	ret += "Please confirm your email address by entering the OTP in the field below.";
	if (bRequired)
		ret += " You must perform this confirmation in order to login.";
	return ret;
}

function getConfirmPhoneTitle() { return "Confirm Phone Number"; }
function getConfirmPhoneInstr(phone, bRequired) {
	var ret = "A One Time Passcode (OTP) has just been sent";
	if (phone && phone.length > 0) {
		ret += " to:<div class='confDsp'>" + phone + "</div><br />";
	} else {
		ret += ".";
	}
	ret += "Please confirm your phone number by entering the code in the field below.";
	if (bRequired) {
		ret += " You must perform this confirmation in order to login.";
	} else {
		ret += " You may click the Cancel button below to skip this step and continue logging in.";
	}
	return ret;
}
	
function getNoNewUserMsg() { return showError("", "No new username provided"); }
function getInvalidNewUserMsg() { return showError("Invalid New Username", "This new username is not a valid format - please enter a different one"); }
function getUnusableNewUserMsg() { return showError("Unusable New Username", "This username cannot be used - please enter a different one"); }
function getUsernameChangeOTPSentMsg() { return showSuccess("", "OTP successfully sent"); }
function getSuccessfulUsernameChangeMsg() { showSuccess("Username Change Successful", "<br /><a href='javascript:closeChngUsr(true)'>Try to continue logging in</a>"); }

function getLoginEnterPWInstr() { return "Please enter your password below to login"; }
function getKBALoginInstr() { return "You must provide both your current password and answer the challenge question(s) below in order to login."; }
function getPWChangeInstr() { return "Please provide your username below then click the 'Continue' button"; }
function getPWChangeCurPWInstr() { return "Please provide your current password then click the 'Continue' button"; }
function getPWChangeChalAInstr() { return "Please answer the question(s) below then click the 'Continue' button"; }
function getPWChangeNewPWInstr() { return "Please provide your new password, confirm it then click the 'Continue' button"; }

function getPWMeterLevel(level) {
	switch (level) {
		case 1: return "Very Weak";
		case 2: return "Weak";
		case 3: return "Good";
		case 4: return "Strong";
		case 5: return "Very Strong";
		default: return "Password Strength";
	}
}

function getSSEnrollmentTitle(ssaction) {
	if (SS_ACTION_ENROLL_CHAL == ssaction) { return "Challenge Answers"; }  //SMC was Enrollment - Challenge Answers
	else if (SS_ACTION_ENROLL_PHONE == ssaction) { return "Mobile Phone"; } //SMC was Enrollment - Mobile Phone
	else if (SS_ACTION_ENROLL_EMAIL == ssaction) { return "Non-SMC Email Address"; }  //SMC was Enrollment - Email Address
	else { return "1126 - Self Service Enrollment"; }
}

function getSSInitialInstr() { return "Please enter your username and click the button below to view the options currently available to you."; }
function getSelfServiceNotAvailableMsg() { return showError("Self Service Unavailable", "No self-service actions are currently available to you.<br /><br />You will need to contact the <span class='italicsEmphasis'>Help Desk</span> to resolve issues with your account."); }
function getSelfServiceNotEnrolled() { return showError("Authentication Type Unenrolled", "The chosen action is not currently available to you because a required enrollment was never performed.<br /><br />You may need to contact the <span class='italicsEmphasis'>Help Desk</span> to resolve issues with your account."); }
function getSSAuthNotAvailable() { return showError("Authentication Type Unavailable", "The chosen authentication type is not enabled for use."); }
function getSSActionsInstr() { return "Please choose an action and click the button below to continue."; }
function getSSAuthTypeInstr() { return "Please choose an authentication type and click the button below to continue."; }

function getSSProveAuthInstr(authtype, conf) {
	if (SS_AUTH_PHONEOTP == authtype || SS_AUTH_EMAILOTP == authtype)
		return getSSEnterOTPInstr(authtype, conf);
	return "getSSProveAuthInstr() called with unexpected authtype: " + authtype;
}

function getSSGroupCQADesc() { return "Challenge answers"; }
function getSSGroupPhoneDesc() { return "Personal phone number"; }
function getSSGroupEmailDesc() { return "Personal email address"; }
function getSSGroupCompleted() { return italicizeSpan(" (Enrolled)"); }
function getSSGroupEnrollInstr(req, total, enrolled, nSkips) {
	var ret = "You must enroll " + boldRedSpan(req + " of the " + total) + " methods shown below. ";
	ret += "This can be used to prove your identity should you forget your password in the future. Please choose an option below then click Continue.";
	if (nSkips > 0)
		ret += " You can skip this enrollment " + boldRedSpan(nSkips) + " more time" + pluralize(nSkips) + " before being forced to enroll.";
	if (enrolled > 0) {
		// Some indicator that they've enrolled at least one but aren't finished
		ret += "<br/><br/>" + boldUnderlineSpan("Status") + ": " + boldGreenSpan((req - enrolled) + " more required");
	}
	return ret;
}

function getSSEnrollInstr(ssaction, bRequired, bSuppress, nSkips) {
	var ret = "Please enter your current password";
	if (SS_ACTION_ENROLL_CHAL == ssaction) {
		ret += " and click the button below to enroll your challenge answers.";
	} else if (SS_ACTION_ENROLL_PHONE == ssaction) {
		ret += " and your phone number to enroll. You may also be prompted to select a mobile phone carrier from a drop-down list. A test message will be sent immediately for confirmation.";
	} else if (SS_ACTION_ENROLL_EMAIL == ssaction) {
		ret += " and an alternative email address to enroll. A test message will be sent immediately for confirmation.";
	} else {
		ret += " to continue self-service enrollment.";
	}
	
	if (bRequired) {
		if (nSkips > 0)
			ret += " You can skip this enrollment " + boldRedSpan(nSkips) + " more time" + pluralize(nSkips) + " before being forced to enroll.";
	} else {
		ret += " You can skip this enrollment but you will be asked to enroll again during your next login.";
		if (bSuppress)
			ret += "<br /><br />To <b>permanently</b> suppress reminders for this authentication type, check the box below before skipping. You can always enroll from the Account Management page.";
	}
	return ret;
}

function getSSEnterOTPInstr(authtype, conf) {
	var ret = "A One Time Passcode (OTP) has been ";
	if (SS_AUTH_PHONEOTP == authtype) {
		ret += "sent to your phone";
		if (conf && conf.length > 0)
			ret += ":<div class='confDsp'>" + conf + "</div>";
		else
			ret += ". ";
		ret += "It could take 10 to 15 seconds";
	} else if (SS_AUTH_EMAILOTP == authtype) {
		ret += "emailed";
		if (conf && conf.length > 0)
			ret += " to:<div class='confDsp'>" + conf + "</div>";
		else
			ret += ". ";
		ret += "It could take 20 to 30 seconds";
	}
	ret += " to be delivered. ";
	if (SS_AUTH_EMAILOTP == authtype) {
	    ret += " Please also check your spam or junk folder for an email from Santa Monica College.";
	}	
	ret += "  Upon receipt, please enter the OTP below.";
	return ret;
}

function getSSEnterNewPWInstr() { return "Please enter your new password in the fields below."; }
function getIdentityVerifiedMsg() { return showSuccess("Identity Verified", ""); }

function getSSDisplayValue(type, thresh) {
	switch (type) {
		// Self-service types
		case SS_ACTION_UNLOCKACCOUNT: 	return "&nbsp;Unlock Account";
		case SS_ACTION_RESETPW: 		return "&nbsp;Reset Forgotten Password";
		case SS_ACTION_RECOVERPW: 		return "&nbsp;Recover/See Current Password";
	
		// Authentication types
		case SS_AUTH_CHALANS:
			if (thresh && thresh > 0)
				return thresh + " Challenge Answer" + pluralize(thresh);
			else
				return "Challenge Answers";
		case SS_AUTH_PHONEOTP:	return "Mobile Phone Number";
		case SS_AUTH_EMAILOTP:	return "Alternate Email Address";
		case SS_AUTH_GENOTP:	return "2nd Factor / One Time Passcode";
		default:				return "[Unknown type: " + type + "]";
	}
}

function getSSUnavailMsgHeader() {
	/* 2017-02-23 - Do NOT use boldRedSpan here due to embedded quotes */
	return "<a style='margin-left:5px' href='javascript:void(0)' onclick='javascript:showSSReason(this, \"<span class=boldred>Unavailable because:</span><ol>";
}
function getSSUnavailMsgLocked(nAction) {
	if (SS_ACTION_RESETPW == nAction || SS_ACTION_RECOVERPW == nAction)
		return "<li>Account is locked</li>";
	return "";
}
function getSSUnavailMsgAuthUnenrolled(nAT) {
	switch (nAT) {
		case SS_AUTH_CHALANS:		return "<li>Challenge answers not enrolled</li>";
		case SS_AUTH_MAND_CHALANS:	return "<li>Mandatory answers not enrolled</li>";			
		case SS_AUTH_PHONEOTP:		return "<li>Mobile phone not enrolled</li>";
		case SS_AUTH_EMAILOTP:		return "<li>Email address not enrolled</li>";
		case SS_AUTH_GENOTP:		return "<li>OTP method not enrolled</li>";
		default:					return "";
	}
}
function getSSUnavailMsgFooter() {
	/* 2017-02-23 - Do NOT use italicizeSpan() here, due to nesting of quotes... */
	return "</ol><i>(Click to close)</i>\")' tabindex='0'>Show Reason</a>";
}

function getSuccessfulSelfServiceMsg(root, bSubmit, thepw) {
	var linkstatus = getLinkResults(root);
	var hdr = "Self-Service Action Successful";
	try {
		var root_ss = getXMLChildElement(root, "ss");
		var ssaction = getXMLAttrNum(getXMLChildElement(root_ss, "action"), "type");
		if (SS_ACTION_UNLOCKACCOUNT == ssaction) {
			hdr = "Account Unlocked Successfully";
		} else if (SS_ACTION_RESETPW == ssaction) {
			hdr = "Password Reset Successfully";
		}
	} catch (e) {}
		
	var ret = "";
	if (thepw && thepw.length > 0) {
		ret += "Your current password is: " + boldRedSpan(thepw) + "<br /><br />";
		ret += "<a href='javascript:" + (bSubmit ? "submitFromSS()" : "closePopup(\"popup_SS\", false, " + (g_bPGClient || g_bSideCar ? "true": "false") + ", PG_AUTHTYPE_LOGIN)") + "'>Try to login with this password</a>";
	} else {
		if (linkstatus.length > 0)
			ret += linkstatus + "<br />";
		
		// 2014-07-07 - Custom redirection after phone enrollment
		/*try {
			var root_ss = getXMLChildElement(root, "ss");
			var ssaction = getXMLAttrNum(getXMLChildElement(root_ss, "action"), "type");
			if (SS_ACTION_ENROLL_PHONE == ssaction) {
				var theform = document.forms[0];
				var newdest = encodeURIComponent("http://www.google.com");
				theform.action = "login.aspx?ReturnUrl=" + newdest;
				alert("Set new destination: '" + newdest + "'");
			}
		} catch (e) {
			alert(formatException("getSuccessfulSelfServiceMsg()", e));
		}*/			
		
		ret += "<br /><a href='javascript:" + (bSubmit ? "submitFromSS()" : "closePopup(\"popup_SS\", false, " + (g_bPGClient || g_bSideCar ? "true": "false") + ", PG_AUTHTYPE_LOGIN)") + "'>Try to continue logging in</a>";
		//ret += "<a href='/_layouts/PG/login.aspx?ReturnUrl=%2fdefault.aspx&pgautopop=6'>Click here to finish</a>";
		//ret += "<a href='javascript:closePGClient()'>Close the browser and secure your data</a>";
	}
	return showSuccess(hdr, ret);
}

function getAcctLinkEnrollInstr() { return "Enter your username and password below to start the account linking process." }
function getAcctLinkInitialInstr() {
	var ret = "<p>For the system shown below, please enter a username and associated password to link the secondary account to your main account.</p>";
	ret += "<p>Linked accounts will automatically be synced when you change/reset your password through this portal.</p>";
	return ret;
}
function getSuccessfulAcctLinkMsg(bSubmit) {
	var ret = "Your linked account password is now the same as your main account password";
	ret += "<br /><br /><a href='javascript:" + (bSubmit ? "submitFromAcctLink()" : "closePopup(\"popup_AcctLink\", false, " + (g_bPGClient ? "true": "false") + ", PG_AUTHTYPE_LOGIN)") + "'>Try to continue logging in</a>";
	return showSuccess("Account Link Successful", ret);
}
function getInitialPWSyncFailureMsg() { return showError("Initial Password Synchronization Failed", "PortalGuard attempted and failed to synchronize your linked account password with your main account." + msg_CONTACT_HD); }

function getLinkResults(root) {
	var ret = "";
	if (root) {	
		// Build table for results if info is present
		var root_res = getXMLChildElement(root, "linkresults");
		if (null != root_res) {
			ret = "<br />" + boldRedSpan("Linked Account Status") + "<table class='linkres_table bgwhite'><tr><th>System</th><th>Username</th><th>Success</th></tr>";
			var kids = root_res.childNodes;
			for (var i = 0; i < kids.length; i++) {
				var bSuccess = (1 == getXMLAttrNum(kids[i], "success") ? true : false);
				var sys = getXMLElementStr(kids[i], "system");
				var user = getXMLElementStr(kids[i], "user");
				ret += "<tr><td class='bold'>" + sys + "</td><td>" + user + "</td>";
				ret += "<td class='align_center'><img border='0' src='/_layouts/images/pg/images/" + (bSuccess ? "green-check-12.png" : "red-X-12.png") + "' alt='" + (bSuccess ? "Completed Successfully" : "Operation Failed") + "' /></td></tr>";
			}
			ret += "</table>";
		}
	}
	return ret;
}

function getHostedSvcMisconfiguredMsg() { return showError("Hosted Service Misconfigured", "OTP delivery failed because the hosted service is not properly configured." + msg_CONTACT_HD); }
function getHostedSvcDeliveryFailedMsg() { return showError("Hosted Service Delivery Failure", "OTP delivery failed." + msg_CONTACT_HD); }
function getHostedSvcAccountIssueMsg() { return showError("Hosted Service Account Issue", "OTP delivery failed due to a problem with the service account." + msg_CONTACT_HD); }
function getSMSDeliveryUnsupportedMsg() { return showError("SMS Delivery Failure", "SMS delivery is not enabled." + msg_CONTACT_HD); }
function getVoiceDeliveryUnsupportedMsg() { return showError("Voice Delivery Failure", "Voice delivery is not enabled." + msg_CONTACT_HD); }

function getOTPResendTitle() { return "You have the following authentication options:"; }
function getOTPResendBtnText() { return "Close Dialog"; }

function getOTPMethodsHTML(otp_root, frmname, func, popupname) {
	var dsp = "";
	if (null != otp_root) {
		var methods_root = getXMLChildElement(otp_root, "methods");
		var resend_root = getXMLChildElement(otp_root, "resend");
		
		// 2017-03-06 - New markup for a11y		
		dsp = "<div id='lblOTPResendTitle'>" + getOTPResendTitle() + "</div>";
		dsp += "<p role='status'>";
		if (null != resend_root) {
			dsp += "<ol>";
			var phones = resend_root.childNodes;	
			if (phones.length > 0) {
				// resendOTP(frmname, func, dtype, phoneidx)
				for (var i = 0; i < phones.length; i++) {
					dsp += "<li>Phone " + italicizeSpan(getXMLAttrStr(phones[i], "conf")) + "<ul>";	// Embedded unordered list
					if (1 == getXMLAttrNum(phones[i], "cansms")) {
						dsp += "<li><a href=\"javascript:resendOTP('" + frmname + "', '" + func + "', " + PG_OTP_DELIVERY_SMS + ", " + i + ")\">";
						dsp += "Send OTP as SMS";
						dsp += "</a></li>";
					}
					// 2014-12-14 - Don't show voice option if it's disabled in bootstrap
					if (1 == getXMLAttrNum(methods_root, "voice")) {
						dsp += "<li><a href=\"javascript:resendOTP('" + frmname + "', '" + func + "', " + PG_OTP_DELIVERY_VOICE + ", " + i + ")\">";
						dsp += "Call phone with voice OTP";
						dsp += "</a></li>";
					}
					dsp += "</ul></li><br />";
				}
			}
			
			var email = getXMLAttrStr(resend_root, "email");
			if (email.length > 0) {
				dsp += "<li>Email " + italicizeSpan(email) + "<ul>";	// Embedded unordered list
				dsp += "<li><a href=\"javascript:resendOTP('" + frmname + "', '" + func + "', " + PG_OTP_DELIVERY_EMAIL + ", 0)\">";
				dsp += "Send OTP in email";
				dsp += "</a></li></ul></li><br />";
			}
		}
		
		if (1 == getXMLAttrNum(methods_root, "yubikey")) {
			dsp += "<li>YubiKey<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_YUBIKEY + ", '', '', '')\">";
			dsp += "Enter OTP from registered YubiKey";
			dsp += "</a></li></ul></li><br />";
		}	
		
		if (1 == getXMLAttrNum(methods_root, "printed")) {
			dsp += "<li>Printed OTPs<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_DELIVERY_PRINT + ", '', '', '')\">";
			dsp += "Enter OTP from printed sheet";
			dsp += "</a></li></ul></li><br />";
		}
		
		if (1 == getXMLAttrNum(methods_root, "helpdesk")) {
			if (!g_bHideHelpDeskOTPMethod) {
				dsp += "<li>" + getHelpDeskOTPPrompt() + "</li>"; //Added by SMC
				/* COMMENTED BY SMC
				dsp += "<li>" + getHelpDeskOTPPrompt() + "<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_DELIVERY_HD + ", '', '', '')\">";
				dsp += "Contact Help Desk to receive OTP";
				dsp += "</a></li></ul></li><br />"; */
			}
		}
		
		if (1 == getXMLAttrNum(methods_root, "mobileapp")) {
			dsp += "<li>Mobile Authenticator<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_DELIVERY_MOBILE + ", '', '', '')\">";
			dsp += "Enter OTP from mobile authenticator";
			dsp += "</a></li></ul></li><br />";
		}
		
		if (1 == getXMLAttrNum(methods_root, "hotp")) {
			dsp += "<li>HOTP Token<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_HOTPTOKEN + ", '', '', '')\">";
			dsp += "Enter HOTP from token";
			dsp += "</a></li></ul></li><br />";
		}
		
		if (1 == getXMLAttrNum(methods_root, "rsa")) {
			dsp += "<li>RSA SecurID<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_RSASECURID + ", '', '', '')\">";
			dsp += "Enter RSA SecurID passcode";
			dsp += "</a></li></ul></li><br />";
		}
			
		if (1 == getXMLAttrNum(methods_root, "extauth")) {
			dsp += "<li>Pattern-based Authentication<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_EXTAUTH + ", '', '', '')\">";
			dsp += "Enter authentication pattern";
			dsp += "</a></li></ul></li><br />";
		}
		
		if (1 == getXMLAttrNum(methods_root, "duopush")) {
			var duophone = getXMLElementStr(otp_root, "duophone");
			dsp += "<li>Duo Push<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_DUOPUSH + ", '" + duophone + "', '', '')\">";
			dsp += "Perform a Duo Push notification to your mobile device" + (duophone.length > 0 && "(incorrect format)" != duophone ? ": " + duophone : "");
			dsp += "</a></li></ul></li><br />";
		}
		
		if (1 == getXMLAttrNum(methods_root, "voicebio")) {
			var voicebiophrase = getXMLElementStr(otp_root, "voicebiophrase");
			dsp += "<li>Voice Biometrics<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_VOICEBIO + ", '', '" + voicebiophrase + "', '')\">";
			dsp += "Say the phrase: '" + voicebiophrase + "'";
			dsp += "</a></li></ul></li><br />";
		}
		
		if (1 == getXMLAttrNum(methods_root, "fidou2f")) {
			dsp += "<li>FIDO U2F Security Key<ul><li><a href=\"javascript:resendOTP('" + frmname + "', '" + func + "', " + PG_OTP_DELIVERY_FIDOU2F + ", 0)\">";
			dsp += "Insert or have your security key ready";
			dsp += "</a></li></ul></li><br />";
		}

		if (1 == getXMLAttrNum(methods_root, "webauthn")) {
			var desc = getXMLElementStr(otp_root, "webauthn_desc");
			dsp += "<li>FIDO2 WebAuthn Device<ul><li><a href=\"javascript:resendOTP('" + frmname + "', '" + func + "', " + PG_OTP_DELIVERY_WEBAUTHN + ", 0)\">";
			dsp += "Insert or have your '" + desc + "' device ready";
			dsp += "</a></li></ul></li><br />";
		}
		
        if (1 == getXMLAttrNum(methods_root, "webkey")) {
            dsp += "<li>WEB-key Biometrics<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_DELIVERY_WEBKEY + ", '', '', '')\">";
            dsp += "Authenticate using your fingerprint.";
            dsp += "</a></li></ul></li><br />";
        }
		
		if (1 == getXMLAttrNum(methods_root, "duootp")) {
			dsp += "<li>Duo Token<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_DELIVERY_DUOOTP + ", '', '', '')\">";
			dsp += "Enter OTP from Duo Token";
			dsp += "</a></li></ul></li><br />";
		}
		
		if (1 == getXMLAttrNum(methods_root, "bkmobile")) {
			dsp += "<li>BIO-key MobileAuth App<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_DELIVERY_BKM_PALM + ", '', '', '')\">";
			dsp += "Perform a Biometrics-based push notification to your enrolled mobile device(s)";
			dsp += "</a></li></ul></li><br />";
		}
		
		if (1 == getXMLAttrNum(methods_root, "authy")) {
			var authyphone = getXMLElementStr(otp_root, "authyphone");
			dsp += "<li>Authy<ul><li><a href=\"javascript:promptForOTP('" + popupname + "', " + PG_OTP_DELIVERY_AUTHY + ", '', '', '" + authyphone + "')\">";
			dsp += "Perform an Authy Push notification to your mobile device" + (authyphone.length > 0 && "(incorrect format)" != authyphone ? ": " + authyphone : "");
			dsp += "</a></li></ul></li><br />";
		}
		
		dsp += "</ol>";
	} else {
		dsp = "No additional OTP options!";
	}

	dsp += "<button id='btnCloseResendOTP' class='PGButton btn' onclick='closeOTPResendPopup()'>" + getOTPResendBtnText() + "</button>";
	dsp += "</p>";
	return dsp;
}

function getOTPResentMsg(delivery) {
	var strDeliver = "SMS/text";
	if (PG_OTP_DELIVERY_VOICE == delivery) {
		strDeliver = "phone call";
	} else if (PG_OTP_DELIVERY_EMAIL == delivery) {
		// SMC.  line just said "email."
		strDeliver = "email!  If you don't see it, please check your spam or junk folder for an email from Santa Monica College.";
	}
	return showSuccess("", "OTP successfully sent via " + strDeliver);
}

function getOTPResendTooSoon(secsremain) { return showError("OTP Resend Requested Too Quickly", "Please allow another " + boldGreenSpan(secsremain) + " second" + pluralize(secsremain) + " before requesting the OTP resend."); }
function getPhoneDoesNotSupportSMS() { return showError("SMS/Texting Unsupported By Phone", "The currently enrolled phone does not support SMS/texting.<br />Re-enroll a different phone to change the capabilities."); }
function getTokenNotEnrolledMsg() { return showError("Unregistered Hardware Token", "You have never registered this token.<br />It must be enrolled from your Account Management page before becoming available for login purposes."); }
function getTokenOTPReplayedMsg() { return showError("", "This OTP has been used previously - please enter another"); }
function getRSANotInitializedMsg() { return showError("RSA Agent Initialization Failure", "The RSA agent on the PortalGuard server failed to successfully initialize."); }
function getRSAServerDownMsg() { return showError("RSA Communication Failure", "Failed establishing connection with RSA Authentication Manager."); }
function getRSAInternalErrorMsg() { return showError("RSA Agent Internal Error", "The RSA agent on the PortalGuard server failed - please check PortalGuard server runtime log."); }
function getRSANextCodeRequiredMsg() { return showError("RSA SecurID Token Uninitialized", "The provided passcode was correct, but the token is not fully initialized.<br /><br />Please visit the <a href='https://your.rsa.server/ssc' target='_blank'>RSA Self-Service Console</a> to complete this setup."); }
function getRSANewPINRequiredMsg() { return showError("New RSA PIN Required", "The provided passcode was correct, but the PIN for the token must be changed.<br /><br />Please visit the <a href='https://your.rsa.server/ssc' target='_blank'>RSA Self-Service Console</a> to complete this setup."); }
function getRSABadUsernameSyntaxMsg() { return showError("", "The provided username was not properly formatted."); }
function getRSABadPasscodeSyntaxMsg() { return showError("", "The provided passcode was not properly formatted."); }

function getSuccessfulChalEnrollment() { return showSuccess("Challenge Answer Enrollment Successful", "<br /><a href='javascript:closeCQA(true)'>Refresh the account management page</a>"); }
function getSuccessfulPhoneEnrollment() { return showSuccess("Phone Enrollment Successful", "<br /><a href='javascript:closePhoneOTPEntry(true)'>Refresh the account management page</a>"); }
function getSuccessfulEmailEnrollment() { return showSuccess("Email Enrollment Successful", "<br /><a href='javascript:closeEmailOTPEntry(true)'>Refresh the account management page</a>"); }
function getSuccessfulAuthyEnrollment() { return showSuccess("Authy Enrollment Successful", "<br /><a href='javascript:closeAuthyOTPEntry(true)'>Refresh the account management page</a>"); }
function getTokenEnrollmentUnavailable() { return showError("Token Enrollment Unavailable", "Token enrollment is not enabled for your account." + msg_CONTACT_HD); }
function getBlankTokenNameMsg() { return showError("Missing Name/Description", "Please provide a name or description for this token"); }
function getMissingTokenOTPMsg() { return showError("", "Please enter an OTP from the token below"); }
function getTokenOTPBadMsg() { return showError("", "The token is invalid or OTP is improperly formatted"); }
function getDuplicateTokenMsg() { return showError("Duplicate Token", "You have already enrolled this hardware token - please cancel or use a different one"); }
function getSuccessfulYubiKeyEnrollment() { return showSuccess("YubiKey Enrollment Successful", "<br /><a href='javascript:closeYubiKeyEnroll(true)'>Refresh the account management page</a>"); }
function getMissingCAPTCHAMsg() { return showError("Missing CAPTCHA", "Please answer the CAPTCHA below"); }

function getBadCAPTCHAMsg(ver) {
	if (1 == ver) {
		return showError("Incorrect CAPTCHA", "Please answer the new CAPTCHA below");
	} else {
		setTimeout(function() { window.location.reload(); }, 10000);
		return showError("Incorrect CAPTCHA", "CAPTCHA has timed out - this page will automatically reload in 10 seconds and you will need to re-enter all values and answer the new CAPTCHA");
	}
}

function getCustVoiceCallSentMsg(conf) { return showSuccess("", "Voice call successfully sent to phone: " + conf); }
function getMobileAppBadLabel() { return showError("Invalid Label", "Please supply a valid entry label. It cannot contain a colon character and must be fewer than 50 characters."); }
function getSuccessfulMobileAppEnable() { return showSuccess("Mobile Authenticator Enabled Successfully", "<br /><a href='javascript:closeMobileApp(true)'>Refresh the account management page</a>"); }


/******************************************************************************/
/* SSO Jump Page */
/******************************************************************************/
function getSSOTitle() { return "&nbsp;Single Sign-On Portal"; }
function getSSOLoggedInAs(nm) { return italicizeSpan(nm); }
function getSSOLogout() { return "Log Out"; }
function getSSOSAMLTabLabel() { return "SAML SSO"; }
function getSSOFormsSSOTabLabel() { return "Password-based SSO"; }
function getSSOSizeSelectorLabel() { return "Size: ";}
function getSSOSizeSmallLabel() { return "Small"; }
function getSSOSizeMediumLabel() { return "Medium"; }
function getSSOSizeLargeLabel() {return "Large"; }

function getLoginSuccessfulMsg() { return showSuccess("Successfully Authenticated", "Click an entry below to seamlessly access the associated website"); }
function getNoSSOServersMsg() { return "<br /><br />" + italicizeSpan("No relying parties found") + "<br />"; }
function getEnrollLinkText() { return "Enroll for SSO to other web sites"; }

/******************************************************************************/
/* Forms-based SSO enrollment */
/******************************************************************************/
function getAddFormsSSOSiteTitle() { return getLogoHTML() + "Enroll for SSO"; }
function getWebSiteLabel() { return "Website"; }
function getSiteListPlaceholder() { return "-- Please choose a website --"; }
function getNoFormsBasedSitesAvailableMsg() { return showWarning("", "No sites are available for enrollment<br /><br /><a href=\"javascript:window.location='" + DEF_SSO_PAGE + "'\">Go back to the SSO portal page</a>"); }
function getUnauthorizedRPMsg() { return showError("Unauthorized WebSite", "User is unauthorized to enroll for SSO to the requested website"); }
function getUnknownRPMsg() { return showError("Unauthorized WebSite", "Requested web site does not exist"); }
function getSSOEnrollSuccessMsg() { return showSuccess("Website Enrollment Successful", "<br /><a href='javascript:closeAddSite()'>Return to the SSO portal page</a>"); }
function getCredVaultWriteErrorMsg() { return showError("Credential Vault Error", "Failed to update user credential vault." + msg_CONTACT_HD); }
function getBadCredVaultSiteIDMsg() { return showError("Invalid Website Identifier", "The supplied identifier was not found in the user credential vault." + msg_CONTACT_HD); }
function getCredVaultInitErrMsg() { return showError("Credential Vault Uninitialized", "Could not create or initialize the user credential vault." + msg_CONTACT_HD); }
function getCredVaultCryptoErrMsg() { return showError("Credential Vault Encryption Error", "The encryption key for the user credential vault could not be retrieved or built." + msg_CONTACT_HD); }

function getSiteDeleteConfirmation(dsp) { return "Are you sure you want to delete credentials for the following website?\n\n     " + dsp; }
function getPrefetchingUrlMsg() { return showSuccess("Prefetching Web Site", "Please wait while your target site is prefetched, this may take a few seconds.<br /><br />A small pop-up window may appear. Please do NOT interact with it."); }
function getExtraInputMissingMsg() { return showError("Missing Input Value", "You must specify values for all fields below when enrolling"); }

function getDisablePopupBlockerMsg(){ 
	window.document.title = "Popup Blocker Detected";
	
	var ret = "<div class='container'><div class='row'><div class='col-md-12 displaybox' style='padding-top:5px'>";
	ret += "<h1 style='color:#000'>Popup Blocker Detected</h1>";
	ret += showError("", "Please disable your browser's popup blocker using the directions below.<br />");
	
	// IE
	ret += "<br /><a id='lnkIE' href=\"javascript:showDPUInstructions('IE')\"><span class=\"browserInstr\">Microsoft Internet Explorer</span></a>&nbsp;&nbsp;<a id='hideIEInstr' href='javascript:showDPUInstructions()'>(collapse section)</a>";
	ret += "<div id='popupIEInstr' style='display:none'><br />It is recommended you only disable pop-ups for the current site '" + window.location.hostname + "'. ";
	ret += "This can be done easily if a notification appeared at the bottom of the browser as shown below. Click the <b>Options for this site</b> button and choose <b>Always allow</b>.";
	ret += "<img class='uaDPUImage img-responsive' src='/_layouts/images/PG/images/disablepopup_IE2.gif' alt='Disabling Internet Explorer Pop-up Blocker, Option 2'><br />";
	ret += "You can also perform the following steps:<ol><li>Click the <b>Tools</b> icon or press Alt-X</li>";
	ret += "<li>Click the <b>Internet Options</b> menu item</li>";
	ret += "<li>Click the <b>Privacy</b> tab</li>";
	ret += "<li>Click the <b>Settings</b> button in the Pop-up Blocker</b> section</li>";
	ret += "<li>Enter " + boldRedSpan(window.location.hostname) + " in the website field</li>";
	ret += "<li>Click the <b>Add</b> button</li></ol>";
	ret += "<img class='uaDPUImage img-responsive' src='/_layouts/images/PG/images/disablepopup_IE.gif' alt='Disabling Internet Explorer Pop-up Blocker'></div><br />";
	
	// Chrome
	ret += "<br /><a id='lnkChrome' href=\"javascript:showDPUInstructions('Chrome')\"><span class=\"browserInstr\">Google Chrome</span></a>&nbsp;&nbsp;<a id='hideChromeInstr' href='javascript:showDPUInstructions()'>(collapse section)</a>";
	ret += "<div id='popupChromeInstr' style='display:none'><br />It is recommended you only disable pop-ups for the current site '" + window.location.hostname + "' using the following steps:";
	ret += "<ol><li>Click the 'Pop-up blocked' icon at the right side of the omnibar</li>";
	ret += "<li>Choose the <b>Always allow pop-ups from " + window.location.hostname + "</b> radio button</li></ol>";
	ret += "<img class='uaDPUImage img-responsive' src='/_layouts/images/PG/images/disablepopup_Chrome.gif' alt='Disabling Chrome Pop-up Blocker'></div><br />";

	// Firefox
	ret += "<br /><a id='lnkFirefox' href=\"javascript:showDPUInstructions('Firefox')\"><span class=\"browserInstr\">Mozilla Firefox</span></a>&nbsp;&nbsp;<a id='hideFirefoxInstr' href='javascript:showDPUInstructions()'>(collapse section)</a>";
	ret += "<div id='popupFirefoxInstr' style='display:none'><br />It is recommended you only disable pop-ups for the current site '" + window.location.hostname + "' using the following steps: ";
	ret += "<ol><li>Click the 'Pop-up Blocked' indicator at the right-hand side of the Location bar</li>";
	ret += "<li>Click the 'Allow pop-ups for " + boldRedSpan(window.location.hostname) + "' entry in the drop-down menu</li>";
	ret += "<li>Close the small pop-up window that appears and go back and click the SSO tile again to login</li></ol>";
	ret += "<img class='uaDPUImage img-responsive' src='/_layouts/images/PG/images/disablepopup_Firefox.gif' alt='Disabling Firefox Pop-up Blocker'></div><br />";
	
	// Safari
	ret += "<br /><a id='lnkSafari' href=\"javascript:showDPUInstructions('Safari')\"><span class=\"browserInstr\">Apple Safari</span></a>&nbsp;&nbsp;<a id='hideSafariInstr' href='javascript:showDPUInstructions()'>(collapse section)</a>";
	ret += "<div id='popupSafariInstr' style='display:none'><br />Safari does not support allowing pop-ups from specific websites so it is recommended you temporarily disable pop-ups using the following steps:";
	ret += "<ul><li>On Windows, press Ctrl-Shift-K to toggle the pop-up blocker setting</li>";
	ret += "<li>On iOS, press Command-Shift-K to toggle the pop-up blocker setting</li></ul>";
	ret += "<img class='uaDPUImage img-responsive' src='/_layouts/images/PG/images/disablepopup_Safari.gif' alt='Disabling Safari Pop-up Blocker'></div>";
	
	ret += "</div></div></div>";
	
	return ret;
}

function getDefaultSaveUADescription() {
	var dtNow = new Date();
	var strDate = formatDate2(dtNow, true, true, false);
	var ret = "", ua = "";
	
	if (isIEBrowser()) {
		ua = "Internet Explorer"
	} else if (isChromeBrowser()) {
		ua = "Chrome";
	} else if (isFirefoxBrowser()) {
		ua = "Firefox";
	} else if (isSafariBrowser()) {
		ua = "Safari";
	}
	
	if (ua.length > 0)
		ret = ua;
	
	if (g_hostname.length > 0) {
		if (ret.length > 0)
			ret += " (";
		ret += g_hostname + ")";
	}
	
	if (ret.length > 0)
		ret += ": ";
	
	ret += strDate;
	return ret;
}

function getExtAuthTitle() { return "Set Authentication Pattern"; }
function getExtAuthInstr() { return "Please enroll the authentication pattern below:"; }
function getAcctMgmtEnrollExtAuthLabel() { return "Enroll authentication pattern"; }
function getAcctMgmtDisableExtAuthLabel() { return "Clear authentication pattern"; }
function getAcctMgmtEnrolledExtAuthLabel() { return "<span class='activityLabel'>Enrolled On:</span> "; }
function getAcctMgmtLastExtAuthLabel() { return "<span class='activityLabel'>Last Used On:</span> "; }
function getExtAuthToggleLabel() { return "Show Pattern While Drawing"; }
function getAcctMgmtExtAuthTooShort(minlen) { return showWarning("Insufficient Data Points", "The authentication pattern must be at least " + boldGreenSpan(minlen) + " dot" + pluralize(minlen) + ".<br />Please try again."); }
function getSuccessfulExtAuthEnable() { return showSuccess("Authentication Pattern Enrolled Successfully", "<br /><a href='javascript:closeExtAuth(true)'>Refresh the account management page</a>"); }
function getAcctMgmtDisableExtAuthPrompt() { return "Are you sure you want to clear your authentication pattern?"; }

function getSessionTimeoutWarning(secleft) {
	var ret = "Your logon session with this server will end in " + secleft + " seconds.<br />";
	ret += "You will automatically be redirected back to the logon page where you must re-enter your credentials."
	//ret += "<br />You can <a href='javascript:window.location.reload(true)'>extend your logon session by clicking this link</a> now.";
	return showError("Logon Session About To Expire", ret);
}

function getExistingPWHasIllegalCharsMsg() { return showError("Password Contains Illegal Character(s)", "Passwords cannot contain the " + boldRedSpan("<") + " character OR the sequence " + boldRedSpan("&#") + "<br /><br />You " + boldRedSpan("must") + " <a href=\"javascript:showSSPopup();\">reset your password</a> before logging in through this website. If you cannot reset your password yourself, then you should contact the Help Desk to change it."); }
//function getExistingPWHasIllegalCharsMsg() { return showError("Password Contains Illegal Character(s)", "Passwords cannot contain the " + boldRedSpan("<") + " character OR the sequence " + boldRedSpan("&#") + "<br /><br />You " + boldRedSpan("must") + " click the button below to reset your password before logging in through this website.<br/><br/><button onclick=\"showSSPopup(); return false;\">Reset Your Password</button>"); }
function getNewPWHasIllegalCharsMsg() { return showError("New Password Contains Illegal Character(s)", "Passwords cannot contain the " + boldRedSpan("<") + " character OR the sequence " + boldRedSpan("&#") + "<br /><br />Please use a different new password that doesn't contain these characters."); }

// User activation
function getActivateUserSuccessMsg(root) {
	return showSuccess("User Identity Proven", "<br />Please click the link below to set your new password and complete the activation process<br /><br /><a href='javascript:completeActivation()'>Set Your Initial Password</a>");
}
function getBadDataGenericMsg() { return showError("", "Invalid or incomplete data - please try again"); }
function getUnregisteredMsg() { return showError("No Activation Data", "No activation data found for this username. Please contact the Help Desk"); }
function getExpiredActivationDataMsg() { return showError("Expired Activation Data", "The activation data on file for this account has expired. Please contact the Help Desk"); }
function getBlankExtraFieldMsg(root) { return showError("", "No value provided"); }
function getWrongExtraFieldMsg(root) { return showError("Incorrect Value", "<br />The value you supplied was incorrect. Please change it and retry."); }
function getActivationSessionExpiredMsg() {
	setElemVisibility(["infoSS", "fldsSS"], false);	// Hide all fields and buttons!
	return showWarning("Session Expired", "<br />You did not set a new password in the allotted time. Please click the link below to reactivate your account and try again.<br /><br /><a href='javascript:history.back()'>Reactivate Your Account</a>");
}

//////////////////////////////
// EVENT HANLDERS
// Can use these as extension points for any pre-processing of AJAX requests
// If the processing should continue, return true
// If the processing should stop, return false

// Called before login attempts
function preLoginHandler(frm, thediv) {
	// Ensure the password doesn't contain anything that IIS will reject as code injection
	if (doesPWContainIllegalChars([ frm[FLD_DSP_PASS] ])) {
		setElemContentDirect(getExistingPWHasIllegalCharsMsg(), thediv);
		return false;
	}
	
	/*if (-1 == frm[FLD_DSP_USER].value.indexOf("@")) {
		setElemContentDirect(showWarning("Use Email Address As Username", "You must use your email address as your username when logging in."), thediv);
		frm[FLD_DSP_USER].focus();
		frm[FLD_DSP_USER].select();
		return false;
	}*/
	
	// 2017-06-05 - Clean up any leading/trailing whitespace on username
	try {
		frm[FLD_DSP_USER].value = strTrim(frm[FLD_DSP_USER].value);
	} catch(e) {}
	
	return true;
}

// Called before password changes (where the user knows their current password)
function preSetPasswordHandler(frm, thediv) {
	if (null != frm.PWChangeStep) {
		var bPrevent = false;
		if ("5" == frm.PWChangeStep.value) {
			// Ensure the password doesn't contain anything that IIS will reject as code injection
			if (doesPWContainIllegalChars([ frm[DEF_FLD_NEWPW], frm[DEF_FLD_CONFPW] ]))
				bPrevent = true;
			
			if (g_bUseHIBP) {
				checkHIBP("NewPassword", thediv, function() { doWSPAuth(frm, thediv);	});
				return false;	// This function is async so always prevent the initial submittal
			}
		} else {
			// 2020-03-25 - When this is here, users with a current password with illegal chars can't continue the PW change process at all!
			if (doesPWContainIllegalChars([ frm[DEF_FLD_PASSWORD] ])) {
				setElemContent(getSetPWIllegalCharsInCurPW(), ["ErrMsgSetPW"]);
				return false;
			}
		}
		if (bPrevent) {
			if (g_bInlineIISIllegalCharsPWRule) {
				// Do NOT overwrite all the complexity rules!
			} else {
				setElemContentDirect(getNewPWHasIllegalCharsMsg(), thediv);
			}
			return false;
		}
	}
	return true;
}

// Called before password resets (where the user has forgotten their current password)
function preResetPasswordHandler(frm, thediv) {
	if (null != frm.SSStep && "5" == frm.SSStep.value) {
		// Ensure the password doesn't contain anything that IIS will reject as code injection
		if (doesPWContainIllegalChars(frm, true)) {
			if (g_bInlineIISIllegalCharsPWRule) {
				// Do NOT overwrite all the complexity rules!
			} else {
				setElemContentDirect(getNewPWHasIllegalCharsMsg(), thediv);
			}
			return false;
		}
		
		if (g_bUseHIBP && null != frm.SSAction && "2" == frm.SSAction.value) {
			checkHIBP("SSNewPassword", thediv, function() { doWSPAuth(frm, thediv);	});
			return false;	// This function is async so always prevent the initial submittal
		}
	}
	return true;
}

/* For the responsive layout of data that shouldn't be in a table (e.g. Acct Mgmt) */
function getLeftColClasses() { return "col-xs-12 col-sm-4 col-md-3"; }
function getRightColClasses() { return "col-xs-12 col-sm-8 col-md-9"; }
function getWideLeftColClasses() { return "col-xs-12 col-sm-6 col-md-4"; }
function getWideRightColClasses() { return "col-xs-12 col-sm-6 col-md-8"; }

/* Utility Functions */
function formatGeneralMsg(divclass, hdr, msg) {
	var ret = "<div class='" + divclass + "'>";
	if (hdr.length > 0)
		ret += "<div class='pgh3'>" + hdr + "</div>";
	return ret + msg;
}
function showSuccess(hdr, msg) { return formatGeneralMsg("successdiv", hdr, msg); }
function showWarning(hdr, msg) { return formatGeneralMsg("warningdiv", hdr, msg); }
function showError(hdr, msg) { return formatGeneralMsg("errordiv", hdr, msg); }
function pluralize(inputNumber) {
	if (inputNumber > 1 || inputNumber == 0) return "s";
	else return "";
}
function italicizeSpan(inp) { return ("<span class='italic'>" + inp + "</span>"); }
function boldSpan(inp) { return "<span class='bold'>" + inp + "</span>"; }
function boldUnderlineSpan(inp) { return "<span style='font-weight:700; text-decoration:underline;'>" + inp + "</span>"; }
function boldRedSpan(inp) { return "<span class='boldred'>" + inp + "</span>"; }
function boldGreenSpan(inp) { return "<span class='boldgreen'>" + inp + "</span>"; }
function getUsernamePrefix() {
	// If present, use RelayState QS param from ReturnUrl QS param
	var returl = getQSVar("ReturnUrl");
	if (returl && returl.length > 0) {
		var relaystate = getQSVarExt("RelayState", returl);
		if (relaystate && relaystate.length > 0) {
			// Parse out server name
			var serv = strBetween(relaystate, "://", "/");
			if (serv.length > 0) {
				serv = serv.toLowerCase();
				
				for (var i = 0; i < g_arrUserPrefixes.length; i++) {
					if (serv == g_arrUserPrefixes[i][0]) {
						g_UserPrefix = g_arrUserPrefixes[i][1];
						break;
					}
				}
			}
		}
	}
}
function hideMobilePhoneTypeSelector(bShow) {
	try {
		setElemVisibility(["OTPEnrollPhoneTypeRadioBtns"], !bShow);
		if (location.pathname.indexOf("login.aspx") >= 0 || location.pathname.indexOf("sidecar.aspx") >= 0) {
			setElemVisibility(["SSPhoneTypeRadioBtns"], !bShow);
		}
	} catch (e) {}
}

function getLanyardLoginButtonText() { return "Login With Your Printed Code"; }
function getLanyardLoginButtonTitle() { return "Login using a printed code"; }
function getNamePWLoginButtonText() { return "Login With Your Name and Password"; }
function getNamePWLoginButtonTitle() { return "Login with a username and password"; }
function getRememberLoginTypeText() { return "Remember this choice"; }
function getLanyardLoginInstr() { return "Please scan your printed card below"; }
function getLanyardLoginVideoPlaceholderMsg() { return "Unable to access video stream (please make sure you have a webcam enabled)"; }
function getLanyardLoginVideoLoadingMsg() { return "Loading video..."; }
function getGoodQROutlineColor() { return "#00FF00"; }
function getBadQROutlineColor() { return "#FF0000"; }
function getLanyardSectionMgmtReqSubmittedMsg() { return showSuccess("Submitted Request", "This page will automatically reload to refelect the results"); }
function getInvalidLanyardFormat() { return showError("Invalid Lanyard Data", "Sorry, this is not a valid login code"); }
function getLanyardNotIssuedMsg() { return showError("Lanyard Login Not Issued", "Please see your teacher to issue a login code"); }
function getLanyardLoginNotAllowedMsg() { return showError("Lanyard Login Not Allowed", "Sorry, but your account is not allowed to login with a printed code"); }
function getLanyardLoginFailedMsg() { return showError("Lanyard Login Failed", "Your code was not valid - please see your teacher to reissue a new printed code"); }
function getLanyardLoginErrorMsg(code) {
    switch (code) {
        case PGAPI_RC_UNAUTHORIZED: return "You are not authorized to perform that operation";
        default: return "Minor error code: " + code;
    }
}

// Duo Security Push messages
function getInstrAllowDuoPush(duophone) {
	var msg = boldGreenSpan("A Duo Push has been initiated") + (duophone.length > 0 && "(incorrect format)" != duophone ? (boldGreenSpan(" to:") + "<div class='confDsp'>" + duophone + "</div><br/>") : "<br/><br/>");
	msg += "Please complete this login on your enrolled device. Screen control will automatically be restored in 60 seconds.";
	return msg;
}
function getDuoPushDeniedMsg() { return showWarning("Duo Push Denied", "The authentication failed because the Duo Push request was explicitly denied"); }
function getDuoPushNotEnrolledMsg(enrollURL) {
	var bShowDuoEnrollURL = true;
	
	clearOTPInstructions();
		
	var msg = "Could not perform a Duo Push request because you have not yet enrolled a device.";
	if (bShowDuoEnrollURL && enrollURL.length > 0) {
		msg += "<br /><a href='" + enrollURL + "' target='_blank'>Click this link to enroll for Duo now.</a>";
	}
	msg += "<br /><br />Please choose a different OTP method from the link below to continue logging in."
	return showWarning("Duo Push Not Enrolled", msg); 
}
function getDuoPushTimedOutMsg() { return showWarning("Duo Push Timed Out", "The authentication failed because the Duo Push request expired before it was allowed/denied"); }
function getDuoPushRequestInvalidMsg() { 
	clearOTPInstructions();
	return showError("Duo Push Unavailable", "The Duo Push request could not be sent due to either a misconfiguration or Duo's service is down.<br/><br/>Please utilize an alternate authentication method to continue."); 
}
function getDuoPushUnknownErrorMsg(){
	clearOTPInstructions();
	return showError("Duo Push Request Failed", "The Duo Push request could not be sent due to an unknown error.<br/><br/>Please utilize an alternate authentication method to continue."); 
}

// App-specific 2FA
function getAppSpecificMFATitle() { return "Multi-factor Login Required"; }
function getAppSpecificInstr(sitenm) { return "The website " + (sitenm.length > 0 ? boldGreenSpan(sitenm) + " " : "") + "requires multi-factor authentication."; }
function getNoOTPEnrolledMsg() { return showError("No OTP Methods Available", "You have not yet enrolled any acceptable 2FA methods. Please go to the <a href='/default.aspx'>Account Management page</a> to enroll, then access this website again."); }

// Voice
function getAcctMgmtVoiceEnabledLabel(displayEnabled) { return displayEnabled ? "<span class='activityLabel'>Enabled On:</span> " : "<span class='activityLabel'>Last recording enrollled on:</span> "; }
function getAcctMgmtDisableVoiceLabel(isDeleteRecording) { return isDeleteRecording ? "Delete all voice recordings" : "Disable voice authentication"; }
function getAcctMgmtEnableVoiceLabel(partiallyEnrolled) { return partiallyEnrolled ? "Continue enrolling voice recordings" : "Enable voice authentication"; }
function getAcctMgmtDisableVoicePrompt(isDeleteRecording) { return isDeleteRecording ? "Are you sure you want to delete all voice recordings?" : "Are you sure you want to disable voice?"; }
function getVoiceNumOfEnrollmentsLabel() { return "<span class='activityLabel'>Voice Enrollments:</span> "; }
function getVoicePhraseLabel() { return "<span class='activityLabel'>Voice phrase:</span> "; }
function getVoiceEnrollments(inp) { return italicizeSpan(inp); }
function getVoicePhrase(inp) { return italicizeSpan(inp); }
function getVoiceTitle() { return "Voice Enrollment"; }
function getVoiceEnabledLabel() { return "<span class='activityLabel'>Enabled On:</span> "; }
function getVoiceLastUsedLabel() { return "<span class='activityLabel'>Last Used:</span> "; }
function getVoiceInstr(enrollments, phrase, isVoice1) { 
	if (0 == enrollments) {
		var ret
		if (isVoice1) {
			ret = "<p>Voice enrollment requires a minimum of 3 recordings of the same phrase.</p>";
		} else {
			ret = "<p>Please choose a phrase then press record and say the phrase within 5 seconds after pressing record to continue.</p>";
		}
		
		return ret;
	} else {
		var ret;
		
		if (isVoice1) {
			ret = "<p>Voice enrollment requires a minimum of 3 recordings of the same phrase, " + enrollments + " recording" + ((enrollments == 1) ? "" : "s") + " enrolled.</p>";
			ret += "<p>" + getVoicePhraseLabel() + phrase + "</p>";
		} else {
			ret = "<p>Press record and say the phrase within 5 seconds after pressing record to continue.</p>";
		}	
		
		return ret;		
	}
}

function getVoiceRecordInstr(doneRecording) { 
	var doneRecStr = doneRecording ? "Done r" : "R";
	return doneRecStr + "ecording" + (doneRecording ? "" : " for 5 seconds");
}
function getAcctMgmtRecordVoicePrompt(phrase) { return "Please say '" + phrase + "' within 5 seconds"; }
function getSuccessfulVoiceEnrollment() { return showSuccess("Voice Recording Enrolled Successfully", "<br /><a href='javascript:closeVoice(true)'>Refresh the account management page</a>"); }
function getSuccessfulVoiceDisabled() { return showSuccess("Voice Disabled Successfully", "<br /><a href='javascript:closeVoice(true)'>Refresh the account management page</a>"); }
function getFailedVoiceEnrollment() { return showError("Voice Recording Enrollment Failed", "<br /><a href='javascript:closeVoice(true)'>Refresh the account management page</a>"); }
function getFailedVoiceDisabled() { return showError("Voice Disable Failed", "<br /><a href='javascript:closeVoice(true)'>Refresh the account management page</a>"); }
function getAcctMgmtSubmitVoicePrompt() { return "Submit voice enrollment?"; }
function getInstrEnterVoiceOTP(voiceBioPhrase) { 
	var bHavePhrase = voiceBioPhrase !== undefined && voiceBioPhrase.length > 0;
	if (bHavePhrase) {
		return "Please press record and say the phrase: <br />" + boldGreenSpan(voiceBioPhrase) + "<br />within 5 seconds after pressing record to continue." 
	} else {
		return "Please press record to continue.";
	}
}
function getOTPVoiceEntryTitle() { return "Voice Phrase Required"; }
function getOTPVoiceLabel() { return "Record Phrase"; }
function getInstrRecordVoiceOTP(voiceBioPhrase, doneRecording) { 
	var bHavePhrase = voiceBioPhrase !== undefined && voiceBioPhrase.length > 0;
	var doneRecStr = doneRecording ? "Done r" : "R";
   
	if (bHavePhrase) {
		return doneRecStr + "ecording the phrase: <br />" + boldGreenSpan(voiceBioPhrase) + "<br />" + (doneRecording ? "" : "for 5 seconds");
	} else {
		return doneRecStr + "ecording" + (doneRecording ? "" : " for 5 seconds");
	}
}

function getBtnSmartCardLogin() { return "Login Using Smart Card"; }

function getFIDOU2FEnrollTitle() { return "FIDO U2F Security Key Enrollment"; }
function getFIDOU2FEnrollInstr() { return "Please insert the USB security key or have the wireless version on hand. When ready, first click the button below to start enrolling. Tap the token when prompted."; }
function getFIDOU2FOperationInstr() { return showWarning("Tap Security Key Now", "Tap the security key within the next " + getFIDOTimeout() + " seconds to complete the operation. You can insert the security key now if needed."); }
function getFIDOU2FNameLabel() { return "Name/Description"; }
function getAcctMgmtFIDOU2FNameHeader() { return "<th>Name</th>"; }
function getAcctMgmtAddFIDOU2FLabel() { return "Add new FIDO U2F Security Key"; }
function getAcctMgmtRemoveFIDOU2FPrompt(thename) { return "Are you sure you want to remove FIDO U2F security key '" + thename + "'?"; }
function getFIDOU2FEnrollBtn() { return "Start Enrollment"; }
function getFIDOTimeout() {
	// This can be different based on the operation
	var thetime = FIDOU2F_SIGNIN_TIMEOUT;
	try { if (PG_AUTHTYPE_ACCT_FIDOU2F == AUTHTYPE) thetime = FIDOU2F_REGISTER_TIMEOUT; } catch(ex) {}
	return thetime;
}
function getFailedFIDOU2FEnrollment(jsonObj) {
	setTimeout(function() { closeFIDOU2FEnroll(false); }, 10000);
	return showError("FIDO U2F Security Key Enrollment Failed", "Enrollment was not completed within the " + getFIDOTimeout() + " second time window, but you can try again. This message will automatically close in 10 seconds."); 
}
function getFailedFIDOU2FSignin(jsonObj) {
	var thetime = FIDOU2F_SIGNIN_TIMEOUT;
	try { if (PG_AUTHTYPE_ACCT_FIDOU2F == AUTHTYPE) thetime = FIDOU2F_REGISTER_TIMEOUT; } catch(ex) {}
	var msg = "Sign-in was not completed within the " + getFIDOTimeout() + " second time window, but you can try again. Click the '" + getResendOTPLinkText() + "' link below to re-iniate sign-in."
	if (4 == jsonObj.errorCode) {
		msg = "Sign-in failed because this token has not been enrolled for your account.<br />You will need to login with a different method.";
	}
	return showError("FIDO U2F Security Key Sign-in Failed", msg); 
}
function getSuccessfulFIDOU2FEnrollment() { return showSuccess("FIDO U2F Security Key Enrollment Successful", "<br /><a href='javascript:closeFIDOU2FEnroll(true)'>Refresh the account management page</a>"); }
function getInstrUseFIDOU2FToken() { return "Please insert the USB security key or have the wireless version on hand. Tap the token when prompted." }
function getFIDOU2FUnsupportedBrowserInstr() { return showWarning("Unsupported Browser", "You appear to be using a browser that does not support FIDO U2F security keys. Recent versions of Google Chrome, Mozilla Firefox and Opera have this support.<br /><br />For this session, please login with a different OTP method."); }

// 2019-05-06 - WebAuthn
function getWebAuthnEnrollTitle() { return "FIDO2 / WebAuthn Device Registration"; }
function getWebAuthnEnrollInstr() { return "Please insert the device or have it on hand. When ready, first click the button below to start registration. Use the device when prompted."; }
function getWebAuthnOperationInstr(desc) { return showWarning("Use Device Now", "Utilize the " + (desc !== undefined ? "'" + boldRedSpan(desc) + "' " : "") + "device within the next " + getFIDOTimeout() + " seconds to complete the operation."); }
function getWebAuthnNameLabel() { return "Name/Description"; }
function getAcctMgmtWebAuthnNameHeader() { return "<th>Name</th>"; }
function getAddWebAuthnLabel() { return "Add new FIDO2 WebAuthn Device"; }
function getWebAuthnDeviceTypeLegend() { return "Device Type"; }
function getWebAuthnPlatformLabel() { return "Built-in/platform device"; }
function getWebAuthnCrossPlatformLabel() { return "Removable USB or Bluetooth"; }
function getAcctMgmtRemoveWebAuthnPrompt(thename) { return "Are you sure you want to remove FIDO2 WebAuthn device '" + thename + "'?"; }
function getWebAuthnEnrollBtn() { return "Start Registration"; }
function getWebAuthnTimeout() {
	// This can be different based on the operation
	var thetime = WEBAUTHN_SIGNIN_TIMEOUT;
	try { if (PG_AUTHTYPE_ACCT_WEBAUTHN == AUTHTYPE) thetime = WEBAUTHN_REGISTER_TIMEOUT; } catch(ex) {}
	return thetime;
}
function getFailedWebAuthnEnrollment(jsonObj) {
	setTimeout(function() { closeWebAuthnEnroll(false); }, 10000);
	return showError("FIDO2 WebAuthn Device Registration Failed", "Registration was not completed within the " + getWebAuthnTimeout() + " second time window, but you can try again. This message will automatically close in 10 seconds."); 
}
function getFailedWebAuthnSignin(jsonObj) {
	var thetime = WEBAUTHN_SIGNIN_TIMEOUT;
	try { if (PG_AUTHTYPE_ACCT_WEBAUTHN == AUTHTYPE) thetime = WEBAUTHN_REGISTER_TIMEOUT; } catch(ex) {}
	var msg = "Sign-in was not completed within the " + getWebAuthnTimeout() + " second time window, but you can try again. Click the '" + getResendOTPLinkText() + "' link below to re-iniate sign-in."
	if (4 == jsonObj.errorCode) {
		msg = "Sign-in failed because this token has not been enrolled for your account.<br />You will need to login with a different method.";
	}
	return showError("FIDO2 WebAuthn Device Sign-in Failed", msg); 
}
function getSuccessfulWebAuthnEnrollment() { return showSuccess("FIDO2 WebAuthn Device Registration Successful", "<br /><a href='javascript:closeWebAuthnEnroll(true)'>Refresh the account management page</a>"); }
function getInstrUseWebAuthnToken() { return "Please have the device on hand and use it when prompted." }
function getWebAuthnUnsupportedBrowserInstr() { return showWarning("Unsupported Browser", "You appear to be using a browser that does not support FIDO2 / WebAuthn. Recent versions of Google Chrome, Mozilla Firefox and Microsoft Edge have this support.<br /><br />For this session, please login with a different OTP method."); }
function getWebAuthnRequiresHTTPSInstr() { return showWarning("Secure HTTPS Connection Required", "You cannot use this feature becaue it requires a secure HTTPS connection"); }
function getWebAuthnRegisterFailed() { return showError("FIDO2 WebAuthn Device Registration Failed", "<br />Either the device could not be found before the timeout or it is not supported"); }
function getFIDO2PWLessUnavailable() { return showError("FIDO2 Passwordless Login Unavailable", "You cannot login with username and FIDO2 token due to security policy configuration<br/>Please utilize a 'standard' login type"); }
function getFIDO2PWLessUnenrolled() { return showError("No FIDO2 Token Enrolled", "You must first enroll a FIDO2 token on the Account Management page before you can login with it"); }

// If the error below occurs, the message will automatically be cleared after the number of seconds below.
//	To prevent the autoclear, set the value below to 0
var AUTOCLEAR_OTPREMOVE_ERROR_SEC = 12;
function getPreventedDefaulOTPRemovalMsg(otptype, arrActions) {
	var msg = "You cannot delete the '" + boldRedSpan(getOTPDeliveryDesc(otptype)) + "' device/method because it is the default for the following action" + pluralize(arrActions.length) + ":";
	msg += "<ul>";
	for (var i = 0; i < arrActions.length; i++) {
		var bullet = "<li>";
		if ("login" == arrActions[i]) {
			bullet += "Website Login";
		} else if ("chgpw" == arrActions[i]) {
			bullet += "Password Change";
		} else if ("radius" == arrActions[i]) {
			bullet += "VPN/RADIUS";
		} else if ("desktop" == arrActions[i]) {
			bullet += "Desktop 2FA";
		} else if ("unlock" == arrActions[i]) {
			bullet += "Account Unlock";
		} else if ("reset" == arrActions[i]) {
			bullet += "Password Reset";
		} else if ("recover" == arrActions[i]) {
			bullet += "Password Recovery";
		}
		bullet += "</li>";
		msg += bullet;
	}
	msg += "</ul>";
	msg += "If your administrator allows it, you will need to change the default OTP method before removing this device/method.";
	return showWarning("Cannot Remove Default Multi-Factor Method", msg);
}

// WEB-key integration
function getInstrUseWEBkey() { return "Please connect your fingerprint to this machine and follow the steps in the popup wizard."; }
function getWEBkeyInfoHeader() { return "WEB-key Authentication"; }
function getWEBkeyErrorHeader() { return "Failed WEB-key Authentication"; }
function getWEBkeyStatus(actionID) {
    switch (actionID) {
        case 1: return showSuccess(getWEBkeyInfoHeader(), "The WEB-key client is loading...");
        case 2: return showSuccess(getWEBkeyInfoHeader(), "Please identify yourself now");
        case 3: return showSuccess(getWEBkeyInfoHeader(), "The WEB-key client software must be installed.");
        case 4: return showSuccess(getWEBkeyInfoHeader(), "The WEB-key client software must be installed.");
        case 5: return showError(getWEBkeyErrorHeader(), "An error has occurred in the WEB-key client! Please restart the transaction.");
        case 6: return showSuccess(getWEBkeyInfoHeader(), "The action has been cancelled.");
        case 7: return showError(getWEBkeyErrorHeader(), "The current WEB-key transaction has expired.");
        case 8: return showError(getWEBkeyErrorHeader(), "The provided WEB-key transaction was not found.");
        default: return showError(getWEBkeyErrorHeader(), "Unknown WEB-key action ID: " + actionID);
    }
}
function getWEBkeyAuthFailed(code) {
    var msg;
    var retry = "<br/><a href='javascript:doWEBkey()'>Try again</a>";
    switch (code) {
        case 0: msg = "Success"; break;
        case 1020: msg = "No match on enrolled user data" + retry; break;
        case 1029: msg = "User cancelled the transaction" + retry; break;
        case 1030: msg = "WEB-key configuration error"; break;
        case 1032: msg = "Communication timeout"; break;
        case 1515: msg = "Fingerprint reader not connected or not detected" + retry; break;
        case 2001: msg = "Session expired"; break;
        case 2004: msg = "Invalid SiteID"; break;
        case 2011: msg = "Person already exists"; break;
        case 2012: msg = "Person is not enrolled"; break;
        case 2013: msg = "Person is already enrolled"; break;
        case 2015: msg = "Person not active"; break;
        case 2016: msg = "Communication error"; break;
        case 2017: msg = "Person not found on WEB-key server"; break;
        case 2021: msg = "WEB-key license violation"; break;
        default: msg = "WEB-key error code: " + code; break;    
    }
    return formatWEBkeyError(msg);
}
function formatWEBkeyMsg(msg) { return showSuccess(getWEBkeyInfoHeader(), msg); }
function formatWEBkeyError(err) { return showError(getWEBkeyErrorHeader(), err); }

function getWEBkeyEnrollTitle() { return "WEB-key Enrollment"; }
function getWEBkeyEnrollInstr() { return "Please ensure the WEB-key client software in installed and your fingerprint reader is connected."; }
function getAcctMgmtWEBkeyEnrolledLabel() { return "<span class='activityLabel'>Last Enrollment On:</span> "; }
function getAcctMgmtWEBkeyLastUsedLabel() { return "<span class='activityLabel'>Last Used:</span> "; }
function getAcctMgmtWEBkeyLastIPLabel() { return "<span class='activityLabel'>Last IP Address:</span> "; }
function getAcctMgmtEnrollWEBkeyLabel() { return "Add/Change WEB-key enrollment"; }
function getAcctMgmtEnrollSuccess() { return showSuccess("WEB-key Enrollment Successful", "<br /><a href='javascript:refreshAcctStatus();'>Refresh the account management page</a>"); }

// For grouped 2FA enrollment
function get2FAEnrollmentTitle(idx) { return "Two-Factor Enrollment Options"; }
function get2FAGroupEnrollInstr(req, total, enrolled) {
	var ret = "You must enroll " + boldRedSpan(req + " of the " + total) + " methods shown below. ";
	ret += "These will be used to prove your identity in a more secure fashion. Please choose an option to enroll then click Continue.";
	if (enrolled > 0) {
		// Some indicator that they've enrolled at least one but aren't finished
		ret += "<br/><br/>" + boldUnderlineSpan("Status") + ": " + boldGreenSpan((req - enrolled) + " more required");
	}
	return ret;
}
function get2FAGroupCompleted() { return italicizeSpan(" (Enrolled)"); }
function getMakeDefaultOTPMethodLabel() { return "Make this my default OTP method"; }

function doingWifiAuthentication() {
	// Change the login page UI to indicate it's being displayed in order to log into WiFi
	setElemContent("Logon to Access WiFi", ["lblMainFormTitle"]);
}
function getWifiAuthenticationDisabled() {
	return showError("WiFi Authentication / Captive Portal Disabled", "This page is being displayed in response to WiFi authentication, but that feature is disabled.<br />Please see the Admin Guide for configuration instructions.")
}
function getWifiAuthenticationTitle() { return "Acceptable Use Terms &amp; Agreement"; }
function getWifiAuthenticationBody() {
	var ret = "<p>You must accept the policy terms below before connecting to the network.</p>";
	ret += "<hr />";
	ret += "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Senectus et netus et malesuada fames ac turpis egestas integer. Quisque id diam vel quam elementum. Mattis aliquam faucibus purus in massa tempor nec. Suspendisse faucibus interdum posuere lorem. Feugiat nisl pretium fusce id velit ut tortor pretium. Neque aliquam vestibulum morbi blandit cursus risus at. In eu mi bibendum neque egestas congue. Donec massa sapien faucibus et molestie. Diam phasellus vestibulum lorem sed risus. Lorem mollis aliquam ut porttitor leo a. Eu feugiat pretium nibh ipsum consequat nisl.</p>";
	ret += "<br /><p>Ut faucibus pulvinar elementum integer enim neque volutpat ac. Pellentesque dignissim enim sit amet venenatis urna cursus eget. Purus non enim praesent elementum facilisis leo vel fringilla. Mauris sit amet massa vitae tortor condimentum. Sit amet cursus sit amet dictum sit amet justo. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Consectetur libero id faucibus nisl. Dignissim diam quis enim lobortis. Turpis massa tincidunt dui ut ornare lectus sit amet est. Et leo duis ut diam quam nulla porttitor massa id. Ante metus dictum at tempor commodo ullamcorper a.</p>";
	ret += "<br /><p>Amet risus nullam eget felis eget nunc lobortis mattis. Eget aliquet nibh praesent tristique magna sit amet purus. Feugiat nisl pretium fusce id. Adipiscing elit ut aliquam purus. Aliquet porttitor lacus luctus accumsan tortor posuere. Scelerisque varius morbi enim nunc faucibus a pellentesque sit. Imperdiet proin fermentum leo vel orci porta non pulvinar. Vitae turpis massa sed elementum tempus. Consectetur libero id faucibus nisl tincidunt eget. Ut morbi tincidunt augue interdum. Etiam dignissim diam quis enim lobortis scelerisque fermentum. Semper eget duis at tellus at urna condimentum mattis pellentesque. Eget lorem dolor sed viverra ipsum nunc. Sit amet tellus cras adipiscing enim eu. Diam maecenas sed enim ut sem viverra aliquet eget. Congue eu consequat ac felis donec et odio.</p>";
	ret += "<br /><p>Diam quis enim lobortis scelerisque. Ac tortor dignissim convallis aenean et tortor. Mauris sit amet massa vitae tortor condimentum lacinia. Metus dictum at tempor commodo ullamcorper a lacus vestibulum. Elementum eu facilisis sed odio morbi quis commodo. Eu volutpat odio facilisis mauris. Quis vel eros donec ac odio tempor orci dapibus ultrices. Purus faucibus ornare suspendisse sed nisi. Nunc faucibus a pellentesque sit. Scelerisque purus semper eget duis at tellus at. Ut enim blandit volutpat maecenas volutpat blandit aliquam. Justo laoreet sit amet cursus sit amet dictum sit amet. Sed blandit libero volutpat sed cras ornare arcu dui vivamus. Pellentesque habitant morbi tristique senectus et. Id neque aliquam vestibulum morbi blandit cursus. Nunc vel risus commodo viverra maecenas. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien. Varius morbi enim nunc faucibus a pellentesque. Purus faucibus ornare suspendisse sed. Dolor purus non enim praesent elementum facilisis.</p>";
	return ret;
}

function getBtnEnroll() { return "Start Enrollment"; }
function getAcctMgmtDeviceHeader() { return "<th>Device</th>"; }
function getBKMobileEnrollTitle() { return "BIO-key MobileAuth App Enrollment"; }
function getBKMobileEnrollInstr() { return "Please install and launch the BIO-key MobileAuth App on your smart phone, then click the Enrollment button below.<br />Here are the links to the <a href='https://apps.apple.com/us/app/bio-key-mobileauth/id1563288118' target='_blank'>iOS</a> and <a href='https://play.google.com/store/apps/details?id=com.BIO_key.mobileAuth' target='_blank'>Android</a> versions."; }
function getAcctMgmtBKMobileEnrolledLabel() { return "<span class='activityLabel'>Last Enrollment On:</span> "; }
function getAcctMgmtBKMobileLastUsedLabel() { return "<span class='activityLabel'>Last Used:</span> "; }
function getAcctMgmtBKMobileLastIPLabel() { return "<span class='activityLabel'>Last IP Address:</span> "; }
function getAcctMgmtBKMobileEnrollLabel() { return "Enroll new BIO-key MobileAuth device"; }
function getAcctMgmtBKMobileRemoveUserLabel() { return "Delete ALL BIO-key MobileAuth App biometric data and devices"; }
function getAcctMgmtRemoveBKMobilePrompt(thename, bAll) {
	var msg = "Are you sure you want to remove ";
	if (bAll) {
		msg += "ALL BIO-key MobileAuth App biometric data and enrolled devices?";
	} else {
		msg += "the BIO-key MobileAuth App with device ID '" + thename + "'?";
	}
	return msg;
}
function getAcctMgmtEnrollBKMobileUnavailable() { return showError("Device Enrollment Unavailable", "BIO-key MobileAuth App enrollment is not enabled for your account." + msg_CONTACT_HD); }
function getSuccessfulBKMobileLoginEnrollment() {
	return showSuccess("BIO-key MobileAuth App Enrollment Successful", "<br /><a href='javascript:submitFromBKMobile()'>Continue logging in</a>");
}
function getSuccessfulBKMobileEnrollment() {
	return showSuccess("BIO-key MobileAuth App Enrollment Successful", "<br /><a href='javascript:refreshAcctStatus();'>Refresh the account management page</a>");
}
function getAsyncBKMobileEnrollCheckMsg(iter, maxwait, enrollurl) {
	// 2021-04-21 - Show a link instead if we're on a mobile device
	if ((isAndroidDevice() || isiOSDevice()) && typeof enrollurl !== 'undefined') {
		if (enrollurl.length > 0) {
			setElemVisibility(["imgBKMobileQRCode"], false);
			var msg = "<a href='" + enrollurl + "' target='_blank'>Click here to launch the app on your mobile device</a>, then follow the instructions to complete enrollment.";
			msg += "<br /><br />Will wait up to " + getDuration(maxwait) + " <a href='javascript:cancelAsyncOp()'>Cancel/Stop Waiting</a>";
			return showSuccess("Awaiting Enrollment Results", msg);
		}
	}
	
	var msg = "Please scan the QR code below in the BIO-key mobile app on your phone, then follow the instructions to complete enrollment.";
	msg += "<br /><br />Will wait up to " + getDuration(maxwait) + " <a href='javascript:cancelAsyncOp()'>Cancel/Stop Waiting</a>";
	return showSuccess("Awaiting Enrollment Results", msg);
}
function getBKMobileEnrollCancelledMsg() {
	return showError("BIO-key MobileAuth App Enrollment Cancelled", "Please click the Cancel button below to re-initialize if you'd like to try again.");
}
function getInstrBKMobilePush(bkmphone) {
	//var msg = boldGreenSpan("A BIO-key Push has been initiated") + (bkmphone.length > 0 && "(incorrect format)" != bkmphone ? (boldGreenSpan(" to:") + "<div class='confDsp'>" + bkmphone + "</div><br/>") : "<br/><br/>");
	var msg = boldGreenSpan("A BIO-key MobileAuth App authentication has been initiated.<br/><br/>");
	msg += "Please complete this login on your enrolled mobile phone.";
	return msg;
}
function getBKMobilePushDeniedMsg() { return showWarning("BIO-key MobileAuth App Authentication Denied", "The authentication failed because the request was explicitly denied"); }
function getBKMobileNotEnrolledMsg() {
	clearOTPInstructions();
	var msg = "Could not perform a BIO-key MobileAuth App authentication because you have not yet enrolled a device.";
	msg += "<br /><br />Please choose a different OTP method from the link below to continue logging in."
	return showWarning("BIO-key MobileAuth App Not Enrolled", msg); 
}
function getBKMobileTimedOutMsg() { return showWarning("BIO-key MobileAuth App Operation Timed Out", "The operation failed because it expired before it completed"); }
function getBKMobileRequestInvalidMsg() { 
	clearOTPInstructions();
	return showError("BIO-key MobileAuth App Unavailable", "The authentication request could not be sent due to either a misconfiguration or the authentication service is down.<br/><br/>Please utilize an alternate authentication method to continue."); 
}
function getBKMobileUnknownErrorMsg(){
	clearOTPInstructions();
	return showError("BIO-key MobileAuth App Request Failed", "The BIO-key MobileAuth App request could not be sent due to an unknown error.<br/><br/>Please utilize an alternate authentication method to continue."); 
}
function getAsyncOperationTimedOutMsg() {
	return showWarning("Operation Timed Out", "The operation was cancelled because it took too long");
}

var g_bUseHIBP = false;
function checkHIBP(pwfldID, thediv, funcContinue) {
	// SHA-1 the password
	var pw = document.getElementById(pwfldID).value;
	if ("" == pw) {	// Allow PG to handle blank passwords as usual
		funcContinue();
		return;
	}
	
	try {
		var hash = sha1Hash(pw);
		var prefix = hash.substring(0, 5);
		var suffix = hash.substring(5);
		
		// Call the API
		var url = "https://api.pwnedpasswords.com/range/" + prefix;
		$.get(url, function(data, status){
			var fld = "", msg = "";
			if ("success" == status) {
				if (data.indexOf(suffix) > 0) {
					msg = showError("Unsafe Password", "This password has been exposed in a prior data breach, please choose a different password.");
					fld = pwfldID;
				} else {
					setTimeout(funcContinue, 10);
				}
			} else {
				msg = showSuccess("Error", "Unexpected HTTP status code: " + status);
			}
			setElemContentDirect(msg, thediv);
			if (fld.length > 0) {
				try {
					document.getElementById(fld).focus();
					document.getElementById(fld).select();
					document.getElementById(fld).className= g_defInputClass + " errorfield";
				} catch (e) {}
			}
			
			// 2019-09-24 - Re-display quality rules if configured to do so!
			if (g_bPremptivePWRules && g_bRealtimePWQuality && g_objPWQuality)
				g_bRecreatePWQualMsg = true;
		});
	} catch (e) {
		console.log(formatException("checkHIBP()", e));
	}
}

var g_IllegalRedir = 0;
function getSetPWIllegalCharsInCurPW() {
	var redir_sec = 10;
	if (0 == g_IllegalRedir) {
		g_IllegalRedir = setTimeout(function() { g_IllegalRedir = 0; showSSPopup(); }, redir_sec * 1000);
	}
	return showWarning("Current Password Must Be Reset", "You must perform a password reset to change your current password.<br/>You will automatically be redirected there in " + redir_sec + " seconds or you can <a href=\"javascript:clearTimeout(g_IllegalRedir); g_IllegalRedir = 0; showSSPopup();\">click this link to start it immediately</a>."); 
}

function getAsyncOpFailedMsg() { return showError("Operation Failed", "Maximum attempts tried, please contact your admin to ensure " + boldRedSpan("PGConnect") + " is running."); }
function getAsyncOpProgressMsg(iter, max) {
	var msg = "Please wait while we check on this operation... ";
	// 2020-04-13 - Only show iteration count on 2nd and later checks
	if (iter > 1) {
		msg += "(check " + iter + " of " + max + ")";
		// Only show cancel option on 3rd and later checks! (don't want cancellations to be too easy!)
		if (iter > 2) {
			msg += "&nbsp;<a href='javascript:cancelAsyncOp()'>Cancel</a>";
		}
	}
	return showSuccess("Checking Progress", msg);
}
function getAsyncPushProgressMsg(iter, maxwait) {
	var msg = "Check your phone for the Push notification";
	msg += "<br /><br />Will wait up to " + getDuration(maxwait) + " <a href='javascript:cancelAsyncOp()'>Cancel/Stop Waiting</a>";
	return showSuccess("Awaiting Push Approval", msg);
}
function getAsyncPushCancelledMsg() {
	return showError("Mobile App Push Cancelled", "Please choose a different method to authenticate");
}
function getDuration(maxwait) {
	if (maxwait >= 60) {
		return (maxwait/60).toFixed(0) + " mins";
	} else {
		return maxwait + " secs";
	}
}


// For New UI
function setDefaultHeaderFooter(){
	var headerDetails = "<div class='logo-container bodyFlex'><div class='branded-logo'><img id='LogoImg' class='center-block img-responsive' alt='Home Page Logo' /><h1 id='lblMainFormTitle' style='margin: 0px;'></h1></div></div>";
	var footerDetails = "<div class='branded-footer'><div id='footer-copyright'></div></div>";
	
	$('body').prepend(headerDetails);
	$('body').append(footerDetails);
}

function headerIcon(){
	$('#userMenu').click(function(){
		if($('#userMenu').hasClass('active')){
			$('#userMenu').removeClass('active');
			$('#menuGlyph').removeClass('fa-angle-right')
			$('#menuGlyph').addClass('fa-angle-down')			
		} else {
			$('#userMenu').addClass('active');
			$('#menuGlyph').removeClass('fa-angle-down')
			$('#menuGlyph').addClass('fa-angle-right')
		}
	});
}

function getHeader(){
	var logoAltTag = "Header Logo";
	return "<div class='logo-container acctFlex'><div class='branded-logo'><img id='LogoImg' class='center-block img-responsive' alt='" + logoAltTag + "' /><h1 id='lblMainFormTitle' style='margin: 0px;'>"+ branding_Logo + "</h1></div><div id='menuWrapper'><div id='userMenu' class='usrMenuBtn'><i class='fas fa-user'></i>&nbsp;<span id='lblLoggedInAs'></span>&nbsp;<i id='menuGlyph' class='fas fa-angle-down'></i></div></div></div><h1 id='maintitle'></h1>";
}

function getUserMenuTemplate(loc){
	var uName = $('#lblLoggedInAs').text();
	//console.log("Location is: " + loc);
	if(loc == "acctmgmt"){
		return "<div class='tac'><span id='lblLoggedInAsMobile' class='italic'>" + uName + "</span></div><ul id='userMenuList'><!-- li><div class='userMenuItem'><i class='fab fa-superpowers' style='font-weight: 900!important;'></i><a id='lnkSSOPage' href='/sso/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'>SSO Portal</a></div></li --><li><div class='userMenuItem'><i class='fas fa-sign-out-alt'></i><a href='javascript:doLogout()'><span id='lblLogout'>Logout</span></a></div></li></ul>";
	} else if (loc == "changePW"){
		return "<div class='tac'><span id='lblLoggedInAsMobile' class='italic'>" + uName + "</span></div><ul id='userMenuList'><li><div class='userMenuItem'><i class='fas fa-user-cog'></i><a id='lnkAcctMgmt' href='/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'> Edit Profile</a></div></li><li><div class='userMenuItem'><i class='fab fa-superpowers' style='font-weight: 900!important;'></i><a id='lnkSSOPage' href='/sso/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'>SSO Portal</a></div></li></ul>";
	} else if (loc == "sso"){
		return "<div class='tac'><span id='lblLoggedInAsMobile' class='italic'>" + uName + "</span></div><ul id='userMenuList'><li><div class='userMenuItem'><i class='fas fa-user-cog'></i><a id='lnkAcctMgmt' href='/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'> Edit Profile</a></div></li><li><div class='userMenuItem'><i class='fas fa-sign-out-alt'></i><a href='javascript:doLogout()'><span id='lblLogout'>Logout</span></a></div></li></ul>";
	} else if (loc == "hd"){
		return "<div class='tac'><span id='lblLoggedInAsMobile' class='italic'>" + uName + "</span></div><ul id='userMenuList'><li><div class='userMenuItem'><i class='fas fa-user-cog'></i><a id='lnkAcctMgmt' href='/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'> Edit Profile</a></div></li><li><div class='userMenuItem'><i class='fab fa-superpowers' style='font-weight: 900!important;'></i><a id='lnkSSOPage' href='/sso/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'>SSO Portal</a></div></li><li><div class='userMenuItem'><i class='fas fa-user-shield'></i><a  href='/pg_dashboard/dashboard.aspx' data-tippy-arrow='true' data-tippy-touch='true'>Admin Dashboard</a></div></li><li><div class='userMenuItem'><i class='fas fa-users-cog'></i><a href='/pg_helpdesk/useraction.aspx' data-tippy-arrow='true' data-tippy-touch='true'>Modify Users</a></div></li><li><div class='userMenuItem'><i class='fas fa-phone-volume'></i><a href='/pg_helpdesk/verbalauth.aspx' data-tippy-arrow='true' data-tippy-touch='true'>Verbal Auth</a></div></li><li><div class='userMenuItem'><i class='fas fa-sign-out-alt'></i><a href='javascript:doLogout()'><span id='lblLogout'>Logout</span></a></div></li></ul>";
	} else if (loc == "hdua"){
		return "<div class='tac'><span id='lblLoggedInAsMobile' class='italic'>" + uName + "</span></div><ul id='userMenuList'><li><div class='userMenuItem'><i class='fas fa-user-cog'></i><a id='lnkAcctMgmt' href='/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'> Edit Profile</a></div></li><li><div class='userMenuItem'><i class='fab fa-superpowers' style='font-weight: 900!important;'></i><a id='lnkSSOPage' href='/sso/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'>SSO Portal</a></div></li><li><div class='userMenuItem'><i class='fas fa-user-shield'></i><a  href='/pg_dashboard/dashboard.aspx' data-tippy-arrow='true' data-tippy-touch='true'>Admin Dashboard</a></div></li><li><div class='userMenuItem'><i class='fas fa-phone-volume'></i><a href='/pg_helpdesk/verbalauth.aspx' data-tippy-arrow='true' data-tippy-touch='true'>Verbal Auth</a></div></li><li><div class='userMenuItem'><i class='fas fa-sign-out-alt'></i><a href='javascript:doLogout()'><span id='lblLogout'>Logout</span></a></div></li></ul>";
	} else if (loc == "hdverbal"){
		return "<div class='tac'><span id='lblLoggedInAsMobile' class='italic'>" + uName + "</span></div><ul id='userMenuList'><li><div class='userMenuItem'><i class='fas fa-user-cog'></i><a id='lnkAcctMgmt' href='/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'> Edit Profile</a></div></li><li><div class='userMenuItem'><i class='fab fa-superpowers' style='font-weight: 900!important;'></i><a id='lnkSSOPage' href='/sso/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'>SSO Portal</a></div></li><li><div class='userMenuItem'><i class='fas fa-user-shield'></i><a href='/pg_dashboard/dashboard.aspx' data-tippy-arrow='true' data-tippy-touch='true'>Admin Dashboard</a></div></li><li><div class='userMenuItem'><i class='fas fa-users-cog'></i><a href='/pg_helpdesk/useraction.aspx' data-tippy-arrow='true' data-tippy-touch='true'>Modify Users</a></div></li><li><div class='userMenuItem'><i class='fas fa-sign-out-alt'></i><a href='javascript:doLogout()'><span id='lblLogout'>Logout</span></a></div></li></ul>";
	} else if (loc == "admin"){
		return "<div class='tac'><span id='lblLoggedInAsMobile' class='italic'>" + uName + "</span></div><ul id='userMenuList'><li><div class='userMenuItem'><i class='fas fa-user-cog'></i><a id='lnkAcctMgmt' href='/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'>Edit Profile</a></div></li><li><div class='userMenuItem'><i class='fab fa-superpowers' style='font-weight: 900!important;'></i><a id='lnkSSOPage' href='/sso/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'>SSO Portal</a></div></li><li><div class='userMenuItem'><i class='fas fa-toolbox'></i><a href='/PG_HelpDesk/HelpDesk.aspx' data-tippy-arrow='true' data-tippy-touch='true'>Help Desk Console</a></div></li><li><div class='userMenuItem'><i class='fas fa-search'></i><a id='DashBoardLink' href='javascript:switchView()' data-tippy-arrow='true' data-tippy-touch='true'>User Lookup</a></div></li><li><div class='userMenuItem'><i class='fas fa-sign-out-alt'></i><a href='javascript:doLogout()'><span id='lblLogout'>Logout</span></a></div></li></ul>";
	} else {
		return "<div class='tac'><span id='lblLoggedInAsMobile' class='italic'>" + uName + "</span></div><span id='lblLoggedInAsMobile' class='italic'></span><ul id='userMenuList'><li><div class='userMenuItem'><i class='fas fa-user-cog'></i><a id='lnkAcctMgmt' href='/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'> Edit Profile</a></div></li><li><div class='userMenuItem'><i class='fab fa-superpowers' style='font-weight: 900!important;'></i><a id='lnkSSOPage' href='/sso/default.aspx' data-tippy-arrow='true' data-tippy-touch='true'>SSO Portal</a></div></li><li><div class='userMenuItem'><i class='fas fa-sign-out-alt'></i><a href='javascript:doLogout()'><span id='lblLogout'>Logout</span></a></div></li></ul>";
	}
}

function getGroupsTippy(){
	return "<div id='newGroupTippy'><h2>Create Group</h2><div class='col-md-12' id='ssoGroupError'></div><div class='col-md-12'><label id='newGroupNameInputLabel' for='newGroupNameInput'>Group Name:&nbsp;</label><input type='text' id='newGroupName' name='newGroupNameInput' autocomplete='false' style='color: #000;' ></div><button class='btn btn-primary' id='btnCreateGroup' onclick='tryAddGroup();'>Create</button></div>";
}

function getSSOHelpText(){
	if (g_bSSOAllowCustomization){
		$('#ssoHelpLink').html("<i class='fas fa-question-circle'></i>&nbsp;Instructions/Help");
		$('#ssoHelpText').html("Drag and drop tiles in any order. When complete,  click the 'Save Changes' button to keep this order going forward across all browsers.<br/><br/>Click the 'Delete Changes' button to return to the prior view.");
		if (g_bUseEditToggle) {
			$('#ssoHelpText').html("Click the 'Edit Mode' toggle to make changes. In Edit Mode, drag and drop tiles in any order. When complete, click the 'Save Changes' button to keep this order going forward across all browsers. Click the 'Delete Changes' button to return to the prior view.");
		}
		if(g_bSSOAllowGroupCreation){
			$('#ssoGroupCreationHelp').html("Click the 'Add Groups' button to create custom groups for your apps. Drag tiles and drop them onto the destination group for reorganization.");
			if (g_bUseEditToggle) {
				$('#ssoGroupCreationHelp').html("In edit mode, click the 'Add Groups' button to create custom groups for your apps. Drag tiles and drop them onto the destination group for reorganization.");
			}
		}
	} else {
		document.getElementById('ssoHelpLink').style.display = "none";
	}
}

function desktopHideFooter(){
	if ("1" == getQSVar('pgclient')) {
		document.getElementById('footer-copyright').style.display = "none";
	}
}




// Authy Integration
function getInstrAuthyPush(authyphone){
	var msg = boldGreenSpan("An Authy Push has been initiated") + (authyphone.length > 0 && "(incorrect format)" != authyphone ? (boldGreenSpan(" to:") + "<div class='confDsp'>" + authyphone + "</div><br/>") : "<br/><br/>");
	msg += "Please complete this login on your enrolled device. Screen control will automatically be restored in 60 seconds.";
	return msg;
}

function getAuthyPushDeniedMsg() { return showError("Authy Request Denied", "The authentication failed because the Authy request was explicitly denied"); }

function getAuthyPushTimedOutMsg() { return showError("Authy Request Timed Out", "The authentication failed because the Authy request expired before it was allowed/denied"); }
function getAuthyPushRequestInvalidMsg() { 
	clearOTPInstructions();
	return showError("Authy Request Unavailable", "The Authy request could not be sent due to either a misconfiguration or Authy's service is down.<br/><br/>Please utilize an alternate authentication method to continue."); 
}
function getAuthyPushUnknownErrorMsg(){
	clearOTPInstructions();
	return showError("Authy Push Request Failed", "The Authy request could not be sent due to an unknown error.<br/><br/>Please utilize an alternate authentication method to continue."); 
}

function invalidAuthyRequestMsg(){ return showError("Authy Request Invalid", "Please verify that the country selection, phone number, and email are valid.");}