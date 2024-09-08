//
// NOTE: This file uses functions from "pg_util.js" so it must always be imported with this file!
//

/* Used as global variables */
var AUTHTYPE;
var DEBUG = false;
var DEV_DEBUG = false;
var strURL = "/_layouts/PG/PG.ashx";
var frmMainLogon = null;
var frmMainDisplay = null;
var bIsIIS = true;
var g_objCQA = null;
var g_bSideCar = false;
var g_bPGClient = false;
var g_bNoPGDBrowserClose = false;
var bDDQuestions = false;
var g_bShowAllPWRules = false;		// 2017-01-02 - Added "g_" prefix
var bStandAlonePWChange = false;	// For changepw.aspx
var g_b2FA = false;
var g_bUsePWMeter = false;
var g_MeterMinScore = 0, g_MeterCurScore = 0;
var g_LastPopup = "";
var g_ssAction;
var g_bNoSubmit = false;
var g_bNeedPhoneProvider = false;
var g_bAlertOnMissingElement = false;
var g_Countries = new Array();
var g_arrC = new Array();
var g_defC = "";
var g_CAPTCHA = null;
var g_bFocusCAPTCHA = false;
var g_AutoAdvanceSSActionChoice = false;
var g_DisplaySSActionChosen = true;
var g_SetPW_CopyPWFromParent = false;
var g_SkipInitPWExpiredMsg = false;
var g_bSubmitFromSSPWReset = false;
var g_bHidePWFieldOnLockout = false;
var g_bAlwaysShowSSErrorsInSidecar = false;
var g_hostname = "";
var g_UserPrefix = "";
// 2015-01-27
var g_bMobileAppUserDesc = false;
var g_defMobileAppDesc = "";
var g_defInputClass = "form-control";
// 2016-12-20
var g_bPremptivePWRules = false;
var g_bRealtimePWQuality = false;
var g_objPWQuality = null;
var g_bRecreatePWQualMsg = false;	// If server-side checks fail
var g_bFocusPWFieldWhenToggled = false;	// Used with the feature that allows users to display pw fields in cleartext
var g_TargetDiv = null;
var g_arrDisabled = [];
var g_bOTPResendDisplayed = false;
var g_bHideHelpDeskOTPMethod = false; // smc changed from false to true
var g_bChromeCredPassing = false;
var g_bShowRememberLoginType = false;
var g_bDuoPushAttempted = false;
var g_bBKMobilePushAttempted = false;
var g_bAuthyPushAttempted = false;		// Authy Integration
var g_bRememberAvailable = false;
var g_bUseAnimations = true;
var JQ_ANIMATE_DURATION = 400;	// In milliseconds
var g_Audio = null;
var g_isVoiceOTP = false;
var g_bClearPWFieldsOnMismatch = false;
var g_bShowServerSidePWRules = false;
var frmWifiAuth = null;
var g_bRequireNetworkAUP = false;
var g_bInlineIISIllegalCharsPWRule = true;
var g_bDisabledControls = false;
var g_objAsyncCtrl = null;
var funcCancelXHR;
// Added for Grouped Cancel Button visibility
var isGrouped = false;

/* ******************************************************************* */
/* String constants */
var PG_FLDNAME_USER 						= "_PG_Login_Field_Username_";
var PG_FLDNAME_PASS 						= "_PG_Login_Field_Password_";
var DEF_FLD_USERNAME 						= "Username";
var DEF_FLD_NEWUSERNAME						= "NewUsername";
var DEF_FLD_PASSWORD 						= "Password";
var DEF_FLD_NEWPW 							= "NewPassword";
var DEF_FLD_CONFPW							= "ConfirmPassword";
var DEF_FLD_LOGINANS						= "LoginAnswer";
var DEF_FLD_OPTANS_BASE						= "OptAns";
var PG_SESS_COOKIE 							= "PGSession";
var MULT_SEP								= ":^:";
var PG_FLDNAME_PWCHANGESTEP					= "PWChangeStep";
var PG_FLDNAME_PHONE						= "Phone";
var PG_FLDNAME_PHONE_PROVIDER				= "SMSProvider";
var PG_FLDNAME_OTP							= "OTP";
var PG_FLDNAME_OTP2							= "OTP2";
var PG_FORM_OTPENTRY 						= "OTPEntryForm";
var PG_FLDNAME_EMAIL						= "Email";
var PG_FLDNAME_ACCTLINKSTEP					= "AcctLinkStep";
var PG_FLDNAME_CHNGUSRSTEP					= "ChngUsrStep";
var PG_FLDNAME_SSSTEP						= "SSStep";
var PG_FLDNAME_SSACTION						= "SSAction";
var PG_FLDNAME_SSAUTH						= "SSAuth";
var PG_FLDNAME_SSGROUPCHOICE				= "SSGrpChoice";
var PG_FLDNAME_LINKUSER						= "linkUsername";
var PG_FLDNAME_LINKPASS						= "linkPassword";
var PG_FLDNAME_LINKGUID						= "linkGUID";
var PG_FLDNAME_ADDSITEUSER					= "SiteUsername";
var PG_FLDNAME_ADDSITEPASS					= "SitePassword";
var PG_FLDNAME_OTP_RESENDTYPE				= "OTPResendType";
var PG_FLDNAME_OTP_RESENDIDX				= "OTPResendIdx";
var PG_FLDNAME_NAME							= "Name";
var PG_FLDNAME_IDX							= "Idx";
var COOKIE_SKIPENROLL_CHAL					= "PGSkipChalEnroll";
var COOKIE_SKIPENROLL_PHONE					= "PGSkipPhoneEnroll";
var COOKIE_SKIPENROLL_EMAIL					= "PGSkipEmailEnroll";
var COOKIE_SKIPENROLL_MOBILEAPP				= "PGSkipMobileAppEnroll";
var PG_COOKIE_REMEMBERUSER					= "PGUser";
var PG_COOKIE_LANG                          = "PGLang";
var PG_COOKIE_LOGINTYPE                     = "PGLoginType";
var PG_FLDNAME_ACCTSTEP						= "AcctStep";
var PG_FLDNAME_PHONETYPE					= "PhoneType";
var PG_FLDNAME_MOBILEAPPDESC				= "EntryDesc";
var RECAPTCHA_CHAL							= "recaptcha_challenge_field";
var RECAPTCHA_RESP							= "recaptcha_response_field";

var PG_AUTHTYPE_LOGIN						= 1;
var PG_AUTHTYPE_SETPW						= 2;
var PG_AUTHTYPE_SETCHAL						= 3;
var PG_AUTHTYPE_TOU							= 4;
var PG_AUTHTYPE_GETQS						= 5;
var PG_AUTHTYPE_GETQS_ANON					= 6;
var PG_AUTHTYPE_CHECK_ANS					= 7;
var PG_AUTHTYPE_PWREC						= 8;
var PG_AUTHTYPE_LOGIN_ANS					= 9;
var PG_AUTHTYPE_GETOPTS						= 11;
var PG_AUTHTYPE_OTPENROLL					= 12;
var PG_AUTHTYPE_OTPENTRY					= 13;
var PG_AUTHTYPE_SS							= 18;
var PG_AUTHTYPE_ACCTLINK					= 19;
var PG_AUTHTYPE_CUSTVOICECALL				= 21;
var PG_AUTHTYPE_CHANGEUSERNAME				= 22;
var PG_AUTHTYPE_CONFIRMEMAIL				= 23;
var PG_AUTHTYPE_SELFREG						= 24;
var PG_AUTHTYPE_SELFREG_EMAILCONF			= 26;
var PG_AUTHTYPE_CONFIRMPHONE				= 27;
var PG_AUTHTYPE_MOBILEAPP_ENROLL			= 28;
var PG_AUTHTYPE_ACTIVATEUSER                = 30;
var PG_AUTHTYPE_FIDO2_PASSWORDLESS			= 33;
var PG_AUTHTYPE_BKMOBILE_ENROLL				= 34;

var PG_ACCT_CHECKOTP                        = 218;
var PG_AUTHTYPE_FORGOTUSER					= 350;
var PG_AUTHTYPE_GROUP2FAENROLL				= 98;	// 2019-10-23 - Not an actual action, only used for submitting that dialog when pressing Enter
var PG_AUTHTYPE_NOENTERKEYSUBMIT			= 99;

/* For sidecar */
var PG_RET_BAD_USER 						= 1;
var PG_RET_BAD_PASS 						= 2;
var PG_RET_STRUCKOUT						= 3;		

/* For new self-service */
var SS_ACTION_NONE 							= 0;
var SS_ACTION_UNLOCKACCOUNT 				= 1;
var SS_ACTION_RESETPW 						= 2;
var SS_ACTION_RECOVERPW 					= 3;
var SS_ACTION_ENROLL_CHAL 					= 0x10;
var SS_ACTION_ENROLL_PHONE 					= 0x20;
var SS_ACTION_ENROLL_EMAIL 					= 0x40;
var SS_ACTION_ENROLL_MAND_CHAL				= 0x100;

var SS_AUTH_NONE 							= 0;
var SS_AUTH_CHALANS 						= 0x10;
var SS_AUTH_PHONEOTP 						= 0x20;
var SS_AUTH_EMAILOTP 						= 0x40;
var SS_AUTH_GENOTP							= 0x80;
var SS_AUTH_MAND_CHALANS 					= 0x100;

var SS_STATE_NONE 							= 0;
var SS_STATE_FAILURE 						= 1;
var SS_STATE_CONTINUE 						= 2;
var SS_STATE_COMPLETE 						= 3;

var PG_OTP_DELIVERY_NONE					= 0;
var PG_OTP_DELIVERY_SMS						= 1;
var PG_OTP_DELIVERY_VOICE					= 2;
var PG_OTP_DELIVERY_EMAIL					= 3;
var PG_OTP_DELIVERY_PRINT					= 4;
var PG_OTP_DELIVERY_HD						= 5;
var PG_OTP_YUBIKEY							= 6;
var PG_OTP_DELIVERY_TTT						= 7;
var PG_OTP_DELIVERY_MOBILE					= 8;
var PG_OTP_HOTPTOKEN						= 9;
var PG_OTP_RSASECURID						= 10;
var PG_OTP_EXTAUTH							= 11;
var PG_OTP_DUOPUSH							= 12;
var PG_OTP_VOICEBIO							= 13;
var PG_OTP_DELIVERY_FIDOU2F					= 14;
var PG_OTP_DELIVERY_WEBAUTHN				= 15;
var PG_OTP_DELIVERY_WEBKEY                  = 16;
var PG_OTP_DELIVERY_DUOOTP                  = 17;
var PG_OTP_DELIVERY_BKM_PALM				= 18;
var PG_OTP_DELIVERY_AUTHY					= 19;

/* Number constants */
var ANSWER_MIN_LEN 							= 4;
var MAX_MAND_QS								= 5;
var MAX_OPT_QS 								= 15;
var QS_PER_SCREEN							= 5;
var MAX_CHALLOGIN_ANS						= 5;

/* Return value constants */
/* Major errors */
var PGAPI_RC_NONE							= 0;
var PGAPI_RC_LOGIN_FAILED					= 1;
var PGAPI_RC_PWCHANGE_SUCCESS				= 2;
var PGAPI_RC_PWCHANGE_FAILED				= 3;
var PGAPI_RC_PWRECOVERY_SUCCESS				= 4;
var PGAPI_RC_PWRECOVERY_FAILED				= 5;
var PGAPI_RC_CHECKLOGINANS_SUCCESS			= 6;
var PGAPI_RC_CHECKLOGINANS_FAILED			= 7;
var PGAPI_RC_CHECKANS_SUCCESS				= 8;
var PGAPI_RC_CHECKANS_FAILED				= 9;
var PGAPI_RC_AUTHED_GETQS_SUCCESS			= 10;
var PGAPI_RC_AUTHED_GETQS_FAILED			= 11;
var PGAPI_RC_GETQS_SUCCESS					= 12;
var PGAPI_RC_GETQS_FAILED					= 13;
var PGAPI_RC_SETANS_SUCCESS					= 16;
var PGAPI_RC_SETANS_FAILED					= 17;
var PGAPI_RC_TOU_SUCCESS					= 18;
var PGAPI_RC_TOU_FAILURE					= 19;
var PGAPI_RC_GETOPTS_SUCCESS				= 20;
var PGAPI_RC_GETOPTS_FAILURE				= 21;
var PGAPI_RC_OPTENROLL_SUCCESS				= 22;
var PGAPI_RC_OPTENROLL_FAILURE				= 23;
var PGAPI_RC_OPTENTRY_SUCCESS				= 24;
var PGAPI_RC_OPTENTRY_FAILURE				= 25;
var PGAPI_RC_RECOVERYENROLLCHECK_SUCCESS	= 26;
var PGAPI_RC_RECOVERYENROLLCHECK_FAILURE	= 27;
var PGAPI_RC_OFFLINERECOVERY_SUCCESS		= 28;
var PGAPI_RC_GENERAL_FAILURE				= 30;
var PGAPI_RC_PG_UNAVAILABLE					= 31;
var PGAPI_RC_CAUGHT_EXCEPTION				= 32;
var PGAPI_RC_GETPWOPTS_FAILURE				= 49;
var PGAPI_RC_GETPWOPTS_SUCCESS				= 50;
var PGAPI_RC_SELFSERVE_FAILURE				= 51;
var PGAPI_RC_SELFSERVE_SUCCESS				= 52;
var PGAPI_RC_ACCTLINK_FAILURE				= 53;
var PGAPI_RC_ACCTLINK_SUCCESS				= 54;
var PGAPI_RC_CUSTVOICECALL_FAILURE			= 57;
var PGAPI_RC_CUSTVOICECALL_SUCCESS			= 58;
var PGAPI_RC_CHANGEUSERNAME_FAILURE			= 59;
var PGAPI_RC_CHANGEUSERNAME_SUCCESS			= 60;
var PGAPI_RC_CONFIRMEMAIL_FAILURE			= 61;
var PGAPI_RC_CONFIRMEMAIL_SUCCESS			= 62;
var PGAPI_RC_SELFREG_FAILURE				= 63;
var PGAPI_RC_SELFREG_SUCCESS				= 64;
var PGAPI_RC_SELFREG_EMAILCONF_FAILURE		= 67;
var PGAPI_RC_SELFREG_EMAILCONF_SUCCESS		= 68;
var PGAPI_RC_CONFIRMPHONE_FAILURE			= 71;
var PGAPI_RC_CONFIRMPHONE_SUCCESS			= 72;
var PGAPI_RC_FORGOTUSER_FAILURE				= 75;
var PGAPI_RC_FORGOTUSER_SUCCESS				= 76;
var PGAPI_RC_ACTIVATEUSER_FAILURE			= 79;
var PGAPI_RC_ACTIVATEUSER_SUCCESS			= 80;
var PGAPI_RC_FIDO2PWLESS_SUCCESS			= 88;
var PGAPI_RC_HDREQ_SUCCESS					= 100;
var PGAPI_RC_HDREQ_FAILURE					= 101;
var PGAPI_RC_USERSEARCH_SUCCESS				= 102;
var PGAPI_RC_USERSEARCH_FAILURE				= 103;
var PGAPI_RC_DBREQ_SUCCESS					= 104;
var PGAPI_RC_DBREQ_FAILURE					= 105;
var PGAPI_RC_REPORT_INIT_SUCCESS			= 106;
var PGAPI_RC_REPORT_INIT_FAILURE			= 107;
var PGAPI_RC_REPORT_SUCCESS					= 108;
var PGAPI_RC_REPORT_FAILURE					= 109;
var PGAPI_RC_CHECKOTP_SUCCESS				= 232;
var PGAPI_RC_VOICE_SUCCESS					= 234;
var PGAPI_RC_VOICE_FAILURE					= 235;
var PGAPI_RC_WEBKEY_SUCCESS					= 240;

/* Minor errors */
var PGAPI_RC_TRIAL_EXPIRED					= 1100;
var PGAPI_RC_AUTH_SERVER_UNAVILABLE			= 1101;
var PGAPI_RC_BAD_REQUEST_TYPE				= 1102;
var PGAPI_RC_UNLICENSED_FEATURE				= 1103;
var PGAPI_RC_BAD_REQUEST_FORMAT				= 1104;
var PGAPI_RC_NOT_INITIALIZED				= 1110;
var PGAPI_RC_UNKNOWN						= 1111;
var PGAPI_RC_INTERNAL_ERROR					= 1120;
var PGAPI_RC_DOCUMENT_NOT_SAVED				= 1121;
var PGAPI_RC_CONFIG_ERROR					= 1122;
var PGAPI_RC_BAD_USER_DATA					= 1123;
var PGAPI_RC_BAD_ADMIN						= 1124;
var PGAPI_RC_UNSUPPORTED_FEATURE			= 1130;
var PGAPI_RC_EMAIL_FAILURE					= 1131;
var PGAPI_RC_LDAP_DSA_UNWILLING_SSL			= 1132;
var PGAPI_RC_TOO_MANY_MATCHES               = 1133;
var PGAPI_RC_UNAUTHORIZED                   = 1134;
var PGAPI_RC_DB_UNAVAILABLE					= 1135;
var PGAPI_RC_INTERNAL_CRYPTO_ERROR          = 1137;
var PGAPI_RC_NO_CA_DEFINED			        = 1138;
var PGAPI_RC_HTTP_CALLOUT_FAILURE			= 1139;
var PGAPI_RC_HTTP_MISSING_RESPONSE			= 1140;
var PGAPI_RC_HTTP_BAD_RESPONSE				= 1141;
var PGAPI_RC_ASYNCOP_USE_FAILURE 			= 1173;
var PGAPI_RC_ASYNCOP_KEY_NOT_FOUND			= 1174;
var PGAPI_RC_AD_STRONG_AUTH_REQD			= 1136;
var PGAPI_RC_IDENG_UNKNOWN					= 1150;
var PGAPI_RC_OPERATION_PENDING				= 1180;
var PGAPI_RC_OPERATION_FAILED				= 1181;
var PGAPI_RC_OPERATION_CANCELLED			= 1182;

var PGAPI_RC_NO_USERNAME_SUPPLIED			= 1200;
var PGAPI_RC_NO_PASSWORD_SUPPLIED			= 1201;
var PGAPI_RC_NO_NEWPW_SUPPLIED				= 1202;
var PGAPI_RC_BLANK_CHAL_ANSWER 				= 1203;
var PGAPI_RC_LOGIN_REQUIRES_CHAL			= 1204;
var PGAPI_RC_REPEATED_ANSWER				= 1206;
var PGAPI_RC_ANS_CONTAINS_QWORD				= 1207;
var PGAPI_RC_NO_NEWUSER_SUPPLIED			= 1208;
var PGAPI_RC_NO_EMAIL_SUPPLIED				= 1209;
var PGAPI_RC_ACTIVATION_NO_DATA				= 1210;
var PGAPI_RC_ACTIVATION_BLANK_FLD			= 1211;

var PGAPI_RC_BAD_USER						= 1300;
var PGAPI_RC_BAD_PASSWORD					= 1301;
var PGAPI_RC_GENERIC_BAD_LOGIN				= 1302;
var PGAPI_RC_INVALID_NEWUSER				= 1303;
var PGAPI_RC_UNUSABLE_NEWUSER				= 1304;
var PGAPI_RC_UNUSABLE_EMAIL					= 1305;
var PGAPI_RC_UNUSABLE_PASSWORD				= 1306;
var PGAPI_RC_STRIKE							= 1310;
var PGAPI_RC_ACCOUNT_STRUCKOUT				= 1311;
var PGAPI_RC_ACCOUNT_DISABLED				= 1312;
var PGAPI_RC_ACCOUNT_EXPIRED				= 1313;
var PGAPI_RC_PWCHANGE_DISABLED				= 1314;
var PGAPI_RC_BAD_CHAL_ANSWER			 	= 1320;
var PGAPI_RC_NO_CAPTCHA						= 1321;
var	PGAPI_RC_BAD_CAPTCHA					= 1322;
var PGAPI_RC_NEWPWS_NOT_MATCH				= 1330;
var PGAPI_RC_INSUFF_BUFFER					= 1331;
var PGAPI_RC_INVALID_INPUT					= 1332;
var PGAPI_RC_USERLOOKUP_NO_MATCHES			= 1333;
var PGAPI_RC_USERLOOKUP_MULT_MATCHES		= 1334;
var PGAPI_RC_INPUT_ERROR					= 1340;
var PGAPI_RC_ACTIVATION_EXPIRED_DATA		= 1341;
var PGAPI_RC_ACTIVATION_EXPIRED_SESS		= 1342;
var PGAPI_RC_ACTIVATION_INVALID_FLD			= 1343;
var PGAPI_RC_LANYARD_NOT_ISSUED				= 1360;
var PGAPI_RC_LANYARD_LOGIN_NOT_ALLOWED		= 1361;
var PGAPI_RC_LANYARD_LOGIN_FAILED		    = 1362;

var PGAPI_RC_PWEXPIRED						= 1400;
var PGAPI_RC_PWEXPINGRACE					= 1401;
var PGAPI_RC_CHAL_ANSWERS_NOT_SET		 	= 1410;
var PGAPI_RC_CHAL_RECOVERY_NOT_ENABLED		= 1411;
var PGAPI_RC_RECOVERY_BLOB_MISSING			= 1412;
var PGAPI_RC_RECOVERY_INVALID				= 1413;
var PGAPI_RC_RECOVERY_LOCKED				= 1414;
var PGAPI_RC_SELFSERV_NOT_ENABLED			= 1415;
var PGAPI_RC_SELFSERV_NOT_ENROLLED			= 1416;
var PGAPI_RC_SSAUTH_NOT_AVAILABLE			= 1417;
var PGAPI_RC_SELFSERV_NEED_ENROLL			= 1418;
var PGAPI_RC_REPOSITORY_NEED_LINK			= 1419;
var PGAPI_RC_INACTIVITY_LOCKOUT				= 1420;
var PGAPI_RC_NEED_USERNAME_CHANGE			= 1421;
var PGAPI_RC_NEED_EMAIL_CONFIRM				= 1422;
var PGAPI_RC_NEED_PHONE_CONFIRM				= 1423;
var PGAPI_RC_NEED_MOBILEAPP_ENROLL			= 1424;
var PGAPI_RC_TOO_MANY_SESSIONS				= 1430;
var PGAPI_RC_RBA_UNSUPPORTED				= 1440;

var PGAPI_RC_CHAL_ANSWER_NOT_COMPLEX		= 1500;
var PGAPI_RC_PW_TOO_SHORT					= 1501;
var PGAPI_RC_PW_TOO_LONG					= 1502;
var PGAPI_RC_PW_INSUFF_LCASE				= 1503;
var PGAPI_RC_PW_INSUFF_UCASE				= 1504;
var PGAPI_RC_PW_INSUFF_NUMERIC				= 1505;
var PGAPI_RC_PW_INSUFF_SPECIAL		 		= 1506;
var PGAPI_RC_PW_AD_COMPLEXITY				= 1507;
var PGAPI_RC_PW_DICTIONARY_HIT				= 1508;
var PGAPI_RC_PW_INSUFF_SCORE				= 1509;
var PGAPI_RC_PW_PREVIOUSLY_USED 			= 1510;
var PGAPI_RC_PW_REGEX_FAILURE				= 1511;
var PGAPI_RC_PW_SYNC_FAILURE				= 1512;
var PGAPI_RC_PW_TOO_YOUNG					= 1515;
var PGAPI_RC_PW_INSUFF_DIFFCHARS			= 1516;

var PGAPI_RC_INVALID_REQUEST_FORMAT			= 1600;
var PGAPI_RC_INVALID_DISALLOWED_ACTION		= 1601;
var PGAPI_RC_INVALID_ACTION					= 1602;
var PGAPI_RC_INVALID_USERLIST				= 1603;
var PGAPI_RC_MISSING_PARAM					= 1604;
var PGAPI_RC_INVALID_CLEARFIELD				= 1605;
var PGAPI_RC_VA_DISABLED					= 1606;
var PGAPI_RC_MISSING_VA_ANSWERS				= 1607;

var PGAPI_RC_OTP_NEED_ENROLLMENT			= 1700;
var PGAPI_RC_OTP_ENTER_OTP					= 1701;
var PGAPI_RC_OTP_BAD_PHONE					= 1702;
var PGAPI_RC_NO_PHONE						= 1703;
var PGAPI_RC_OTP_BAD_PROVIDER				= 1705;
var PGAPI_RC_EMAIL_BAD_FORMAT				= 1706;
var PGAPI_RC_EMAIL_BAD_DOMAIN				= 1707;
var PGAPI_RC_OTP_MISSING					= 1710;
var PGAPI_RC_OTP_BAD						= 1711;
var PGAPI_RC_OTP_STRIKE						= 1712;
var PGAPI_RC_OTP_EXPIRED					= 1713;
var PGAPI_RC_OTP_NOT_SENT					= 1714;
var PGAPI_RC_OTP_RESENT						= 1720;
var PGAPI_RC_OTP_RESEND_TOO_SOON			= 1721;
var PGAPI_RC_OTP_SMS_UNSUPPORTED			= 1722;
var PGAPI_RC_PHONE_DUPLICATE				= 1723;
var PGAPI_RC_TOKEN_ENROLL_NOT_AVAILABLE		= 1724;
var PGAPI_RC_TOKEN_NAME_NOT_SUPPLIED		= 1725;
var PGAPI_RC_TOKEN_DUPLICATE				= 1726;
var PGAPI_RC_TOKEN_BAD						= 1727;
var PGAPI_RC_TOKEN_NOT_ENROLLED				= 1728;
var PGAPI_RC_TOKEN_OTP_REPLAYED				= 1729;
var PGAPI_RC_TOKEN_REQ_REPLAYED				= 1730;
var PGAPI_RC_FIDO2_PWLESS_UNAVAILABLE		= 1740;
var PGAPI_RC_FIDO2_PWLESS_UNENROLLED		= 1741;
var PGAPI_RC_DUOPUSH_ALLOWED				= 1750;
var PGAPI_RC_DUOPUSH_DENIED					= 1751;
var PGAPI_RC_DUOPUSH_NOT_ENROLLED			= 1752;
var PGAPI_RC_DUOPUSH_TIMEDOUT				= 1753;
var PGAPI_RC_DUOPUSH_UNKNOWN_ERR			= 1754;
var PGAPI_RC_DUOPUSH_REQ_INVALID			= 1755;
var PGAPI_RC_BKMOBILE_ALLOWED			 	= 1780;
var PGAPI_RC_BKMOBILE_DENIED				= 1781;
var PGAPI_RC_BKMOBILE_NOT_ENROLLED			= 1782;
var PGAPI_RC_BKMOBILE_TIMEDOUT				= 1783;
var PGAPI_RC_BKMOBILE_UNKNOWN_ERR			= 1784;
var PGAPI_RC_BKMOBILE_REQ_INVALID			= 1785;
var PGAPI_RC_AUTHY_ALLOWED					= 1786;
var PGAPI_RC_AUTHY_DENIED					= 1787;
var PGAPI_RC_AUTHY_NOT_ENROLLED				= 1788;
var PGAPI_RC_AUTHY_TIMEDOUT					= 1789;
var PGAPI_RC_AUTHY_UNKNOWN_ERR				= 1790;
var PGAPI_RC_AUTHY_REQ_INVALID				= 1791;


var PGAPI_RC_SERVICE_MISCONFIGURED			= 1800;
var PGAPI_RC_SERVICE_ACCT_ISSUE				= 1801;
var PGAPI_RC_SERVICE_DELIVERY_FAILURE		= 1802;
var PGAPI_RC_SMS_UNSUPPORTED				= 1803;
var PGAPI_RC_VOICE_UNSUPPORTED				= 1804;

var PGAPI_RC_RSA_INIT_FAILURE				= 1830;
var PGAPI_RC_RSA_SERVER_DOWN				= 1831;
var PGAPI_RC_RSA_MEM_INVALID				= 1832;
var PGAPI_RC_RSA_NEXT_CODE_REQ				= 1833;
var PGAPI_RC_RSA_NEW_PIN_REQ				= 1834;
var PGAPI_RC_RSA_BAD_USER_SYNTAX			= 1835;
var PGAPI_RC_RSA_BAD_CODE_SYNTAX			= 1836;


var AUTHTYPE_KBA 							= 80;
var AUTHTYPE_NAME_PASSWORD 					= 100;
var AUTHTYPE_PW_AND_KBA 					= 200;
var AUTHTYPE_OTP 							= 300;
var AUTHTYPE_TWO_FACTOR 					= 400;
var AUTHTYPE_2FA_METHOD_PHONE 				= 410;
var AUTHTYPE_2FA_METHOD_EMAIL 				= 411;
var AUTHTYPE_2FA_METHOD_YUBIKEY 			= 412;
var AUTHTYPE_2FA_METHOD_TTT 				= 413;
var AUTHTYPE_2FA_METHOD_PRINTED 			= 414;
var AUTHTYPE_2FA_METHOD_HD 					= 415;
var AUTHTYPE_2FA_METHOD_MOBILE				= 416;
var AUTHTYPE_2FA_METHOD_HOTP				= 417;
var AUTHTYPE_2FA_METHOD_RSA					= 418;
var AUTHTYPE_2FA_METHOD_EXTAUTH				= 419;
var AUTHTYPE_2FA_METHOD_DUOPUSH				= 420;
var AUTHTYPE_2FA_METHOD_VOICEBIO			= 421;
var AUTHTYPE_2FA_METHOD_FIDOU2F				= 422;
var AUTHTYPE_2FA_METHOD_WEBAUTHN			= 423;
var AUTHTYPE_2FA_METHOD_WEBKEY  			= 424;
var AUTHTYPE_2FA_METHOD_DUOOTP  			= 425;
var AUTHTYPE_2FA_METHOD_AUTHY	  			= 428;
var AUTHTYPE_2FA_METHOD_BKMOBILE_PALM 		= 440;
var AUTHTYPE_BLOCKED 						= 1000;

// Admin Dashboard
var PG_AUTHTYPE_DBACTION		= 102;
var PG_AUTHTYPE_REPORT_INIT 	= 103;
var PG_AUTHTYPE_REPORT_GENERATE = 104;
/* ******************************************************************* */


// This global is down here so it can use the defined constant above
var defaultAction = PG_AUTHTYPE_LOGIN;

var g_bClearOTPValueOnError = false;

function setFormFocus(frm) {
	try {
		if (frm.elements[FLD_DSP_USER].value.length > 0) {
			frm.elements[FLD_DSP_PASS].focus();
		} else {
			frm.elements[FLD_DSP_USER].focus();	// 2015-12-10 - Restored default focus
			frm.elements[FLD_DSP_USER].select();
		}
	} catch (e) {}
}


function setLoginType(loginType) {
	setElemVisibility(["fldStaticPWLogin", "btnFirstContinue", "btnStaticPWLogin"], false);
	
	if (loginType == 2) {
		// Prompt user for name only so we can determine the login requirements
		defaultAction = PG_AUTHTYPE_GETOPTS;
		setElemVisibility(["btnFirstContinue"], true);
		setElemContent(getLoginInstr(false), ["infoLogin"]);
	} else {
		// Prompt user for name & password
		defaultAction = PG_AUTHTYPE_LOGIN;
		// 2013-06-21 - Now showing self-service button automatically
		setElemVisibility(["fldStaticPWLogin", "btnStaticPWLogin", "btnSelfServe"], true);
		setElemContent(getLoginInstr(true), ["infoLogin"]);
	}
	setAuthType(defaultAction);
}


function getPWMeterFunc() {
	// Use of 'this' works in IE now when registering with attachEvent()?
	return function() { updateMeter(this.value); };
}


function showPWMeter(bShow) {
	g_bUsePWMeter = bShow;
	setElemVisibility(["pwmeter1", "pwmeter2"], bShow);
	setElemVisibility(["spanContinueBtn"], !bShow);
}


function enableSetPWButton(bShow) {
	setElemVisibility(["spanContinueBtn"], bShow);
}


// Exits immediately if the feature is disabled
function saveRememberedUsername() {
	if (0 != g_rememberUsernameDays) {
		if (frmMainLogon.elements["RememberUsername"].checked) {
			var user = frmMainLogon.elements[FLD_DSP_USER].value;
			var expires = new Date();
			if (-1 == g_rememberUsernameDays) {
				expires = null;
			} else {
				expires.setDate(expires.getDate() + g_rememberUsernameDays);
			}
			setCookie(PG_COOKIE_REMEMBERUSER, user, expires, "/");
		} else {
			deleteCookie(PG_COOKIE_REMEMBERUSER, "/");
		}
	}
}


function useRememberedUsername(bFocusPW) {
	if (0 != g_rememberUsernameDays) {
		var user = getCookie(PG_COOKIE_REMEMBERUSER);
		if (user && user.length > 0) {
			frmMainLogon.elements["RememberUsername"].checked = true;	// Indicates to the that it was auto-populated
			frmMainLogon.elements[FLD_DSP_USER].value = user;
			if (bFocusPW)
				frmMainLogon.elements[FLD_DSP_PASS].focus();
		}
	}
}


function createLangSelectors() {
	// List of select fields -AND- the containing spans - must be same number!
	var arrLists = [ "listLangSel" ];
	var arrSpans = [ "LangSel" ];
	
	if (arrLangsAvailable.length > 0) {
		for (var f = 0; f < arrLists.length; f++) {
			var sel = document.getElementById(arrLists[f]);
			sel.options.length = 0;	// Clear any existing options
			for (var i = 0; i < arrLangsAvailable.length; i++) {
				var val = arrLangsAvailable[i][0];
				var dsp = arrLangsAvailable[i][1];
				sel.options[sel.options.length] = new Option(dsp, val);
				if (val == SEL_LANG)
					sel.options[sel.options.length-1].selected = true;
			}
			
			setElemVisibility([arrSpans[f]], true);
		}
	}
}


function changeLang(sel) {
	var val = sel.options[sel.selectedIndex].value;
	var expires = new Date();
	expires.setDate(expires.getDate() + 365*10);	// Persists for 10 years
	setCookie(PG_COOKIE_LANG, val, expires, "/");
	location.reload();
}


function formatException(func, e) {
	var outp = func + " error\n=====================\n";
	outp += e.message;
	/*for (var i in e) {
		outp += i + ": " + e[i] + "\n";
	}*/
	// Some browsers support outputing the entire call stack
	//console.log(e.stack);
	return outp;
}


/* 2017-03-06 - Constrain tabbing to fields on the dialog */
function mainTabControl(bPrevent) {
	var arrCtrls = ["listLangSel", "btnChangeLang", "frmLogin_UserName", "RememberUsername", "frmLogin_Password", "showpwsMain", "frmLogin_RememberMe", "btnLoginContinue", "btnLogin", "btnSetPW", "btnSelfServe"];
	for (var i = 0; i < arrCtrls.length; i++) {
		try {
			if (bPrevent) {
				$("#" + arrCtrls[i]).attr("tabindex", -1);
			} else {
				$("#" + arrCtrls[i]).removeAttr("tabindex");
			}
		} catch(e) {}	// Ignore issues with individual fields
	}
}

function setElemContentDirect(val, elem) {
	try {
		// 2017-03-06 - JAWS with IE11 was reading the text context *literally* first (angle brackets, etc), then the HTML 2nd. Wasn't a problem with Chrome with the old way.
		//elem.innerHTML = elem.textContent = val;
		elem.innerHTML = val;
	} catch (e) { 
		console.log(formatException("setElemContentDirect() - Error setting content for element '" + elem + "'", e)); 
	}
}
function setElemContent(val, arrElem) {
	for (var i = 0; i < arrElem.length; i++) {
		var elem = document.getElementById(arrElem[i]);
		if (elem) {
			setElemContentDirect(val, elem);
		} else {
			console.log("setElemContent() - Could not find element id '" + arrElem[i] + "'");
		}
	}
}

function setElemTitle(val, arrElem) {
    for (var i = 0; i < arrElem.length; i++) {
        var elem = document.getElementById(arrElem[i]);
        if (elem) {
            elem.setAttribute("title", val);
        }
    }
}

function setInputValue(val, arrElem) {
	for (var i = 0; i < arrElem.length; i++) {
		var elem = document.getElementById(arrElem[i]);
		if (elem) {
			try {
				elem.value = val;
			} catch (e) {
				alert(formatException("setInputValue() - Error setting content for element id '" + arrElem[i] + "'", e));
			}
		} else {
			alert("setInputValue() - Could not find element id '" + arrElem[i] + "'");
		}
	}
}


function handleKeyPress(fld, e, bIsChalAns) {
	var charCode;
	if (e) {
		e = e;
		if (e.which)
			charCode = e.which; 	// Netscape
		else
			charCode = e.keyCode;	// Firefox
	} else {
		e = event;
		charCode = e.keyCode;	// IE
	}

	fld.className = g_defInputClass;
		
	try {
		// 2018-05-22 - We call this function with either 2 or 3 args. Some browsers don't handle missing args as expected so be more explicit.
		if (bIsChalAns !== undefined && bIsChalAns) {
			// Need to recompute number answered each time for accuracy-sake
			CalcRemainingAnswers();
		}		
	} catch (e) {
		alert(formatException("handleKeyPress(bIsChalAns)", e));
	}
			
	return false;
}


function wireAutoTab(curElem, nextElem, maxLen) {
	curElem.onkeyup = 
		function(e) {
			e = e || window.event;	// To work with IE or FF
			var KeyID = e.charCode ? e.charCode : (e.keyCode ? e.keyCode : 0);
			if ((curElem.value.length >= maxLen) && ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105))) {
				nextElem.focus();
			}
		};
			
	nextElem.onkeydown = 
		function (e) {
			e = e || window.event;	// To work with IE or FF
			var KeyID = e.charCode ? e.charCode : (e.keyCode ? e.keyCode : 0);
			switch (KeyID) {
			case 8:		// Backspace
			case 46:	// Delete
				if (nextElem.value.length == 0) {
					curElem.focus();
					// Required to work in IE, setting focus places the caret at the start of the text input
					curElem.value = curElem.value;
				}
				break;
			}
		};
}


// Just a wrapper around a bool so we can pass a bool by reference
function wrapbool() {
	this.value = false;
}


function populateCountries(root_c) {
	if (g_Countries.length > 0 || !root_c)
		return;	// Already built the drop-downs
	
	try {
		// Build arrays of all countries
		var nodes = root_c.childNodes;
		for (i = 0; i < nodes.length; i++) {
			var nm = getXMLAttrStr(nodes[i], "nm");
			var ab = getXMLAttrStr(nodes[i], "ab");
			if ("1" == getXMLAttrStr(nodes[i], "def"))
				g_defC = ab;
			g_arrC[nm] = ab;
			g_Countries[g_Countries.length] = getXMLAttrStr(nodes[i], "nm");
		}	

		// Sort array
		g_Countries.sort();

		// Set all country drop-downs
		try {
			setCountryOptions(document.getElementById("PhoneCOTPEnroll"));
			// 2021-09-23 - 'AuthyPhoneCCEnroll' is null on the login page. This field only exists on the Acct MGMT page.
			setCountryOptions(document.getElementById("AuthyPhoneCCEnroll"));
			setCountryOptions(document.getElementById("PhoneCSS"));
		} catch (e) {}

		try {
			setCountryOptions(document.getElementById("PhoneCAcctMgmt"));
		} catch (e) {}
	} catch (e) {
		alert(e);
	}
}


function setCountryOptions(sel) {
	// 2021-09-23 - Adding a null check so a hard exception doesn't get thrown when a null element ('AuthyPhoneCCEnroll' doesn't exists on login page) is passed.
	if(null == sel){ return; }
	sel.options.length = 0;	// Clear any existing options
	for (var i = 0; i < g_Countries.length; i++) {
		var dsp = g_Countries[i];
		var val = g_arrC[g_Countries[i]];
		sel.options[sel.options.length] = new Option(dsp, val);
		if (val == g_defC)
			sel.options[sel.options.length-1].selected = true;
	}
	sel.className = g_defInputClass;
}


function clearFieldClasses(frm) {
	for (i = 0; i < frm.elements.length; i++) {
		//alert("elem[" + i + "]: Type: " + frm.elements[i].type + ", Name: " + frm.elements[i].name + ", Value: " + frm.elements[i].value);
		if (frm.elements[i].type == "button") {
			// skip
		} else if (frm.elements[i].type == "hidden") {
			// skip
		} else if (frm.elements[i].type == "checkbox") {
			frm.elements[i].className = "";	// 2017-01-19 - Do NOT set the default type on checkboxes - it makes them multi-line!
        } else if (frm.elements[i].type == "text" || frm.elements[i].type == "password" || frm.elements[i].type == "select-one" || frm.elements[i].type == "tel") {
            if ("" != frm.elements[i].id)
			    $("#" + frm.elements[i].id).removeClass("errorfield");
		}
	}	
}


function addNVPair(nm, theval) {
	var ret = "";
	// Don't send any fields without a name attribute
	if (nm.length > 0)
		ret = "&" + encodeURIComponent(nm) + "=" + encodeURIComponent(theval);
	return ret;
}


function addPOSTFields(frm, objFormData) {
	var data = "";
	var bUseFormData = (typeof objFormData === "undefined" ? false : true);
	for (i = 0; i < frm.elements.length; i++) {
		//console.log("elem[" + i + "]: Type: " + frm.elements[i].type + ", Name: " + frm.elements[i].name + ", Value: " + frm.elements[i].value);
		if (frm.elements[i].type == "hidden" || frm.elements[i].type == "text" || frm.elements[i].type == "password" || frm.elements[i].type == "tel") {
			// 2010-07-05 - For opt answers on reset, we must swap around the field values we're actually submitting since the question ordering may not be sequential
			var bDefHandling = true;
			var nm = frm.elements[i].name;
			var pos = nm.indexOf(DEF_FLD_OPTANS_BASE);
			if (pos >= 0) {
				try {
					if (g_objCQA) {
						if (bDDQuestions) {
							// 2011-04-08 - Need to handle both enrollment and use of challenge answers
							var theval = "";
							var j = parseInt(nm.substr(pos + DEF_FLD_OPTANS_BASE.length), 10);
							// See if any of our question drop-downs selected this number
							for (var q = 1; q <= (g_objCQA.bSetCQA ? g_objCQA.nOptShares : g_objCQA.nOptThreshold); q++) {
								try {
									var sel = document.getElementById("OQ" + q);
									if (parseInt(sel.options[sel.selectedIndex].value) == j) {
										theval = document.getElementById(DEF_FLD_OPTANS_BASE + q).value;
										data += addNVPair(nm, theval);
										if (bUseFormData) { objFormData.frm.append(nm, theval); }
										bDefHandling = false;
										break;
									}			
								} catch (e) {}						
							}

							// We'll override the value for every answer field in this mode
							if (bDefHandling) {
								data += addNVPair(nm, "");
								if (bUseFormData) { objFormData.frm.append(nm, ""); }
								bDefHandling = false;
							}
						} else {
							if (!g_objCQA.bSetCQA) {
								var j = parseInt(nm.substr(pos + DEF_FLD_OPTANS_BASE.length), 10);
								var idx = parseInt(g_objCQA.ResetFieldMap[j], 10);
								var theval = "";
								if (idx > 0)
									theval = document.getElementById(DEF_FLD_OPTANS_BASE + idx).value;
								data += addNVPair(nm, theval);
								if (bUseFormData) { objFormData.frm.append(nm, theval); }
								bDefHandling = false;
							}
						}
					}
				} catch (e) {
					alert(formatException("addPOSTFields() - Caught error on field: " + nm, e));
				}
			}
			
			if (bDefHandling) {
				var bAppendUserPrefix = false;
				if (g_UserPrefix && g_UserPrefix.length > 0) {
					if (isBaseForm() && FLD_DSP_USER == frm.elements[i].name)
						bAppendUserPrefix = true;
					else if (!isBaseForm() && DEF_FLD_USERNAME == frm.elements[i].name)
						bAppendUserPrefix = true;
				}
				
				/* 2018-08-27 - For converting a YubiKey OTP to lowercase if the user has CAPS LOCK on */
				if (PG_FLDNAME_OTP == frm.elements[i].name && 44 == frm.elements[i].value.length)
					frm.elements[i].value = frm.elements[i].value.toLowerCase();
				
				data += addNVPair(frm.elements[i].name, (bAppendUserPrefix ? g_UserPrefix : "") + frm.elements[i].value);
				if (bUseFormData) { objFormData.frm.append(frm.elements[i].name, (bAppendUserPrefix ? g_UserPrefix : "") + frm.elements[i].value); }
			}
		} else if (frm.elements[i].type == "select-one") {
			try {
				if (frm.elements[i].options.length > 0) {
					data += addNVPair(frm.elements[i].name, frm.elements[i].options[frm.elements[i].selectedIndex].value);
					if (bUseFormData) { objFormData.frm.append(frm.elements[i].name, frm.elements[i].options[frm.elements[i].selectedIndex].value); }
				}
			} catch (e) {/* Suppress error if select has no options */}
		} else if (frm.elements[i].type == "select-multiple") {
			var seldata = "";
			for (var idx = 0; idx < frm.elements[i].options.length; idx++) 
				if (0 == idx)
					seldata += frm.elements[i].options[idx].value;
				else
					seldata += MULT_SEP + frm.elements[i].options[idx].value;
			data += addNVPair(frm.elements[i].name, seldata);
			if (bUseFormData) { objFormData.frm.append(frm.elements[i].name, seldata); }
		} else if (frm.elements[i].type == "radio") {
			if (frm.elements[i].checked) {
				data += addNVPair(frm.elements[i].name, frm.elements[i].value);
				if (bUseFormData) { objFormData.frm.append(frm.elements[i].name, frm.elements[i].value); }
			}
		} else if (frm.elements[i].type == "checkbox") {
			if (frm.elements[i].checked) {
			    data += addNVPair(frm.elements[i].name, frm.elements[i].value);
				if (bUseFormData) { objFormData.frm.append(frm.elements[i].name, frm.elements[i].value); }
			}
		}
	}
	
	// 2010-01-29 - Add the name of the fields containing the username & pw so the DLL can find them
	//	Only the login form should have non-standard field names
	if (isBaseForm()) {
		data += "&" + encodeURIComponent(PG_FLDNAME_USER) + "=" + encodeURIComponent(FLD_DSP_USER) + "&" + encodeURIComponent(PG_FLDNAME_PASS) + "=" + encodeURIComponent(FLD_DSP_PASS);
		if (bUseFormData) { objFormData.frm.append(PG_FLDNAME_USER, FLD_DSP_USER); objFormData.frm.append(PG_FLDNAME_PASS, FLD_DSP_PASS); }
	} else {
		data += "&" + encodeURIComponent(PG_FLDNAME_USER) + "=" + encodeURIComponent(DEF_FLD_USERNAME) + "&" + encodeURIComponent(PG_FLDNAME_PASS) + "=" + encodeURIComponent(DEF_FLD_PASSWORD);
		if (bUseFormData) { objFormData.frm.append(PG_FLDNAME_USER, DEF_FLD_USERNAME); objFormData.frm.append(PG_FLDNAME_PASS, DEF_FLD_PASSWORD); }
	}
	
	// 2020-04-08 - For asynchronous ops
	data += (g_objAsyncCtrl ? "&txid=" + g_objAsyncCtrl.getTXID() : "");
	
	// 2013-03-04 - Chop off the leading '&' char
	return data.substr(1);
}


function toggleInputFields(frm, bDisable) {
	// 2020-04-08 - Multiple calls here with same flag led to the disabled ctrls array being filled mistakenly and those fields *staying* disabled!
	if (g_bDisabledControls && bDisable)
		return;
	g_bDisabledControls = bDisable;
	
	// Handle the cursor
	if (bDisable)
		document.body.style.cursor = "wait";
	else
		document.body.style.cursor = "default";

	// Handle the buttons and input fields
    if (null != frm) {
        for (var i = 0; i < frm.elements.length; i++) {
            if (frm.elements[i].type == "button" ||
			        frm.elements[i].type == "text" ||
			        frm.elements[i].type == "password" ||
			        frm.elements[i].type == "checkbox" ||
			        frm.elements[i].type == "select-one" ||
			        frm.elements[i].type == "radio" || 	// 2012-09-07 - Don't forget about radio buttons!
                    frm.elements[i].type == "textarea" || // 2017-03-20
					frm.elements[i].type == "submit")	// 2018-05-22 - Bootstrap buttons are this type
            {
                if (bDisable) {
					// 2018-06-27 - Only add named elements to this array (was problem in VerbalAuth)
                    if (frm.elements[i].disabled && "" != frm.elements[i].name) {
                        // Track that this field was already disabled!
                        g_arrDisabled.push(frm.elements[i].name);
                    }
                    $(frm.elements[i]).prop('disabled', true);	// 2018-05-22 - Use jQuery to handle this
                } else {
                    var bReEnable = true;
                    for (var idx = 0; idx < g_arrDisabled.length; idx++) {
                        if (frm.elements[i].name == g_arrDisabled[idx]) {
                            bReEnable = false;
                            break;
                        }
                    }

                    if (bReEnable) {
                    	$(frm.elements[i]).prop('disabled', false);
					}
                }
            }
        }
    }
	
	// After re-enabling controls, clear out the fields we wanted to remember
	if (!bDisable)
		g_arrDisabled = [];
}

function doWSPAuthExt(frm, thediv, proc, audio) {
	g_Audio = audio;
	doWSPAuth(frm, thediv, proc);
	g_Audio = null;
}

function doWSPAuth(frm, thediv, proc) {
	// 2012-08-31 (SSPM-8) - This choke point should prevent all extraneous submittals (by mouse or keyboard)
	if (g_bNoSubmit) {
		return;
	}
	
	var xmlHttpReq = false;
	var bSent = false;
	g_TargetDiv = thediv;
	
	if (window.XMLHttpRequest) {
		xmlHttpReq = new XMLHttpRequest();
		//xmlHttpReq.overrideMimeType('text/xml');
	} else if (window.ActiveXObject) {
		xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	if (!proc || proc.length == 0)
		proc = "checkError";
	
	try {
		preAJAXSubmitHandler(frm);
		
		if (strURL) {
			xmlHttpReq.open("POST", strURL, true);
			
			// 2014-09-11 - Special handling for iOS to prevent multiple callbacks
			if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
				xmlHttpReq.onload = function(event) {
					eval(proc + "(frm, xmlHttpReq.responseText, thediv);"); 
				}
				// 2021-04-27 - Resuming iOS browser actions
				xmlHttpReq.onerror = function(event) {
					setTimeout(function() { resumeiOSOperation(event); }, 100);
				}
			} else {
				xmlHttpReq.onreadystatechange = function() {
					if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) { 
						eval(proc + "(frm, xmlHttpReq.responseText, thediv);"); 
					}
				}
			}
			
			var postdata;
			if (null == g_Audio) {
				xmlHttpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				postdata = addPOSTFields(frm) + "&Auth=" + AUTHTYPE;
			} else {
				postdata = new FormData();
				var obj = { "frm":postdata };	// Need to wrap it in an object to pass by reference in JS
				addPOSTFields(frm, obj);
				postdata.append('thewavfile', g_Audio.audioBlob);
				postdata.append('Auth', AUTHTYPE);
			}
			
			updateMainForm(frm);
			
			xmlHttpReq.send(postdata);
			
			funcCancelXHR = function() { 
				try {
					g_bNoSubmit = false; /* Required to allow subsequent submits! */
					if (null != xmlHttpReq && (typeof xmlHttpReq !== "undefined")) {
						if (xmlHttpReq.readyState != 4) { 
							//console.log("Aborting XHR"); 
							xmlHttpReq.abort(); 
						} else {
							//console.log("XHR already complete");
						}
					} else { 
						//console.log("XHR object not cancellable:", xmlHttpReq); 
					} 
				} catch (e) {
					console.log(formatException("Caught exception in funcCancelXHR()", e));
				}
			};
			bSent = true;
		}
	} catch (e) {
		alert(formatException("doWSPAuth()", e));
	}
	
	// 2010-02-01 - Only do if successfully POSTed the data (otherwise UI appears hanged)
	if (bSent) {
		clearFieldClasses(frm);
		toggleInputFields(frm, true);
		// 2010-10-19 - Clear the error msg div so it doesn't affect subsequent centering on successful actions & dialog advancement
		if (g_objAsyncCtrl && g_objAsyncCtrl.isRetry()) {
			// 2020-04-08 - Do NOT clear the retry message!
		} else {
			setElemContentDirect("", thediv);
		}
		g_bNoSubmit = true;		// 2012-08-07 - To prevent accidental/duplicate submittals
	}
}


function setMainFields(frm, flduser, fldpass) {
	if (flduser && flduser.length > 0) {
		try {
			frmMainLogon.elements[FLD_SUBMIT_USER].value = frmMainDisplay.elements[FLD_DSP_USER].value = frm.elements[flduser].value;
			if (g_bSideCar) {
				try {
					parent.setUsername(frm.elements[flduser].value);
				} catch (e) {}
			}
		} catch (e) {
			var outp = "setMainFields(): AUTHTYPE: " + AUTHTYPE + "\nForm: " + frm.name + "\nCouldn't copy popup field '" + flduser + "' to main form";
			alert(outp);
		}
	}
		
	if (fldpass && fldpass.length > 0 && !bStandAlonePWChange) {
		try {
			try {
				frmMainLogon.elements[FLD_SUBMIT_PASS].value = frmMainDisplay.elements[FLD_DSP_PASS].value = frm.elements[fldpass].value;
			} catch (ex) {
				var tmp = "2012-01-20 - failed copy due to pw cleartext display";
			}
			if (g_bSideCar) {
				try {
					parent.setPassword(frm.elements[fldpass].value);
				} catch (e) {}
			}
		} catch (e) {
			var outp = "setMainFields(): AUTHTYPE: " + AUTHTYPE + "\nForm: " + frm.name + "\nCouldn't copy popup field '" + fldpass + "' to main form";
			alert(outp);
		}
	}
}


function isBaseForm() {
	if (PG_AUTHTYPE_LOGIN == AUTHTYPE || PG_AUTHTYPE_TOU == AUTHTYPE || PG_AUTHTYPE_GETOPTS == AUTHTYPE || PG_AUTHTYPE_CUSTVOICECALL == AUTHTYPE || PG_AUTHTYPE_FIDO2_PASSWORDLESS == AUTHTYPE)
		return true;
	return false;
}


function updateMainForm(frm) {
	switch (AUTHTYPE) {
	case PG_AUTHTYPE_LOGIN:		// This is only redundant if display form is same as submittal form
		setMainFields(frm, FLD_DSP_USER, FLD_DSP_PASS);
		break;
	case PG_AUTHTYPE_SETPW:
		setMainFields(frm, DEF_FLD_USERNAME, DEF_FLD_NEWPW);
		break;
	case PG_AUTHTYPE_SETCHAL:
		setMainFields(frm, DEF_FLD_USERNAME, DEF_FLD_PASSWORD);
		break;
	case PG_AUTHTYPE_TOU:
		break;
	case PG_AUTHTYPE_GETQS:			// Enter user & pw, get CQs (goes to 3)
		setMainFields(frm, DEF_FLD_USERNAME, DEF_FLD_PASSWORD);
		break;
	case PG_AUTHTYPE_GETQS_ANON:	// Enter user, get CQs
		setMainFields(frm, DEF_FLD_USERNAME);
		break;
	case PG_AUTHTYPE_CHECK_ANS:		// Enter CAs to reset PW (username present)
		//setMainFields(frm, DEF_FLD_USERNAME, DEF_FLD_NEWPW);
		break;
	case PG_AUTHTYPE_PWREC:			// New pw for reset (username present)
		setMainFields(frm, DEF_FLD_USERNAME, DEF_FLD_NEWPW);
		break;
	case PG_AUTHTYPE_LOGIN_ANS:		// CA for login (username, pw present)
		setMainFields(frm, DEF_FLD_USERNAME, DEF_FLD_PASSWORD);
		// 2014-01-30 - Write the challenge answer(s) to the main form as well
		for (var i = 1; i <= MAX_CHALLOGIN_ANS; i++) {
			frmMainLogon.elements[DEF_FLD_LOGINANS + i].value = frm.elements[DEF_FLD_LOGINANS + i].value;
		}
		break;
	case PG_AUTHTYPE_GETOPTS:		// Only username entered on main form already
		break;
	case PG_AUTHTYPE_OTPENROLL:		// Static password is entered, username field cannot be edited
		setMainFields(frm, "", DEF_FLD_PASSWORD);
		break;
	case PG_AUTHTYPE_OTPENTRY:		// OTP is entered, username field cannot be edited
		if (g_b2FA)
			setMainFields(frm, "", DEF_FLD_PASSWORD);
		else
			setMainFields(frm, "", PG_FLDNAME_OTP);
		// 2012-06-13 - Write the OTP to the main form as well
		frmMainLogon.elements[PG_FLDNAME_OTP].value = frm.elements[PG_FLDNAME_OTP].value;
		break;
	case PG_AUTHTYPE_SS:
		// 2014-10-23 - Fix for PG Desktop enrollment
		setMainFields(frm, (g_bPGClient ? DEF_FLD_USERNAME : ""), DEF_FLD_PASSWORD);
		break;
	case PG_AUTHTYPE_ACCTLINK:
		setMainFields(frm, DEF_FLD_USERNAME, DEF_FLD_PASSWORD);
		break;
	case PG_AUTHTYPE_FIDO2_PASSWORDLESS:
		setMainFields(frm, FLD_DSP_USER, FLD_DSP_PASS);
		break;
	}
}


function isHidden(fld) {
	if (fld.type == "hidden")
		return true;
	return false;
}


function setElemVisibility(arrFields, bShow, bNoCollapse) {
	for (var i = 0; i < arrFields.length; i++) {
		var e = document.getElementById(arrFields[i]);
		if (e) {
			if (bShow) {
				if (bNoCollapse)
					e.style.visibility = "visible";
				else
					//e.style.display = "inline";
					e.style.display = "";
			} else {
				if (bNoCollapse)
					e.style.visibility = "hidden";
				else
					e.style.display = "none";
			}
		} else {
			if (g_bAlertOnMissingElement)
				alert("setElemVisibility() - Could not find element named '" + arrFields[i] + "'");
		}
	}
}


function setCaretPosition(elemId, caretPos) {
    var elem = document.getElementById(elemId);

    if (elem != null) {
        if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        } else {
            if (elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            } else
                elem.focus();
        }
    }
}


function changeType(fld) {
	// 2017-02-17 - IE9+ supports updating the 'type' attribute
	try {
		if (fld.type == "text")
			fld.type = "password";
		else
			fld.type = "text";
	} catch (e) {
		console.log("changeType() exception: " + e);
	}
}


function getXMLChildElement(root, e_name, idx) {
	try {
		if (null == root)
			return null;
		if (idx === undefined)
			idx = 0;
		return root.getElementsByTagName(e_name)[idx];
	} catch (e) {
		alert(formatException("getXMLChildElement(): Error getting element '" + e_name + "', index " + idx, e));
		return null;
	}
}


function getXMLElementStr(root, e_name, idx) {
	try {
		var child = getXMLChildElement(root, e_name, idx);
		if (null != child && null != child.firstChild) {
			if (typeof(child.textContent) != "undefined") 
				return child.textContent;	// For FF 4K XML node limit: http://www.coderholic.com/firefox-4k-xml-node-limit/
			else
				return child.firstChild.nodeValue;
		} else {
			return "";
		}
	} catch (e) {
		alert(formatException("getXMLElementStr(): Error getting '" + e_name + "'", e));
		return "";
	}
}


function getXMLElementNum(root, e_name, idx) {
	try {
		var retStr = getXMLElementStr(root, e_name, idx);
		if (null != retStr && retStr.length > 0) {
			return parseInt(retStr, 10);
		} else {
			return 0;
		}
	} catch (e) {
		alert(formatException("getXMLElementNum(): Error getting '" + e_name + "' value", e));
		return 0;
	}
}


function getXMLElementData(root, e_name, idx) {
	try {
		var child = getXMLChildElement(root, e_name, idx);
		if (null != child && null != child.firstChild)
			return child.firstChild.data;
		else
			return "";
	} catch (e) {
		alert(formatException("getXMLElementData(): Error getting '" + e_name + "' value", e));
		return "";
	}		
}


function getXMLAttrStr(elem, attr_name) {
	try {
		if (null == elem)
			return "";
			
		var tmp = elem.getAttribute(attr_name);
		if (null != tmp)
			return tmp;
		else
			return "";
	} catch (e) {
		alert(formatException("getXMLAttrStr(): Error getting attribute '" + attr_name + "'", e));
		return "";
	}
}
	

function hasXMLAttr(elem, attr_name) {
	try {
		if (elem && null != elem.getAttribute(attr_name))
			return true;
	} catch (e) {
		alert(formatException("hasXMLAttr(): Error getting attribute '" + attr_name + "'", e));
	}
	return false;
}


function getXMLAttrNum(elem, attr_name) {
	try {
		var retStr = getXMLAttrStr(elem, attr_name);
		if (retStr.length > 0) {
			return parseInt(retStr, 10);
		} else {
			return 0;
		}
	} catch (e) {
		alert(formatException("getXMLAttrNum(): Error getting attribute '" + attr_name + "'", e));
		return 0;
	}
}


function resolveField(strType) {
	if (DEF_FLD_USERNAME == strType) {
 		if (PG_AUTHTYPE_LOGIN == AUTHTYPE || PG_AUTHTYPE_GETOPTS == AUTHTYPE || PG_AUTHTYPE_FIDO2_PASSWORDLESS == AUTHTYPE)
			return FLD_DSP_USER;
		else if (PG_AUTHTYPE_ACCTLINK == AUTHTYPE)
			if (document.getElementById("AcctLinkForm").elements[PG_FLDNAME_ACCTLINKSTEP].value == "")
				return PG_FLDNAME_LINKUSER;
	} else if (DEF_FLD_PASSWORD == strType) {
		if (PG_AUTHTYPE_LOGIN == AUTHTYPE || PG_AUTHTYPE_GETOPTS == AUTHTYPE)
			return FLD_DSP_PASS;
		else if (PG_AUTHTYPE_ACCTLINK == AUTHTYPE)
			if (document.getElementById("AcctLinkForm").elements[PG_FLDNAME_ACCTLINKSTEP].value == "")
				return PG_FLDNAME_LINKPASS;
	}
	return strType;
}


function checkXMLCondition(root, cond) {
	var root_min = getXMLChildElement(root, "min_errors");
	var min_errs = getXMLAttrNum(root_min, "count");
	for (var i = 0; i < min_errs; i++) {
		var min_err = getXMLElementNum(root_min, "min_error", i);
		if (DEBUG)
			alert("Min_error[" + i + "]: " + min_err);

		if (PG_RET_BAD_USER == cond) {
			if (PGAPI_RC_BAD_USER == min_err) {
				if (DEBUG) alert("Bad username condition detected");
				return true;
			}
		} else if (PG_RET_STRUCKOUT == cond) {
			var strikesleft = 1;	// Any non-zero value
			try {
				var root_lockout = getXMLChildElement(root, "lockout");
				if (root_lockout)
					strikesleft = getXMLElementNum(root_lockout, "strikesleft");
			} catch (e) {}
				
			if (strikesleft <= 0 || PGAPI_RC_ACCOUNT_STRUCKOUT == min_err) {
				if (DEBUG) alert("Locked account condition detected");
				return true;
			}
		} else if (PG_RET_BAD_PASS == cond) {
			if (PGAPI_RC_BAD_PASSWORD == min_err ||
				PGAPI_RC_STRIKE == min_err ||
				PGAPI_RC_BAD_CHAL_ANSWER == min_err ||
				PGAPI_RC_OTP_STRIKE == min_err)
			{
				if (DEBUG) alert("Bad password condition detected");
				return true;
			}
		}
	}
	return false;
}


function checkError(frm, strResp, thediv) {
	toggleInputFields(frm, false);
	
	// Only defined in PG for Domino - fixes state of checkboxes...
	if (window.fixDisabledFieldsState)
		fixDisabledFieldsState();
	
	if (strResp != "") {
		var xmlDoc;
		
		if (DEBUG)
			alert("Response length: " + strResp.length + "\nResponse: '" + strResp + "'");

		try {
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(strResp, "text/xml");
		} catch(e) {
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		  	xmlDoc.async = "false";
		  	xmlDoc.loadXML(strResp);  
		}
		
		var root = getXMLChildElement(xmlDoc, "pg_return");
		g_bNoSubmit = false;	// 2012-08-31 - Waiting as long as possible before allowing another submit. Can't wait longer because processing may trigger an auto-submit.
		if (handleError(frm, root, thediv)) {
			// Only here if we should login
			setElemContentDirect("", thediv);
			saveRememberedUsername();
			submitLoginFromPopup();
		} else {
			// 2019-05-13 - WebAuthn consideration
			if (g_bClearOTPValueOnError) {
				// 2020-10-14 - FIDO U2F for SSPR: Do NOT clear out the OTP on success!
				var maj_err = getXMLElementNum(root, "maj_error");
				if (PGAPI_RC_PWCHANGE_SUCCESS != maj_err && PGAPI_RC_SELFSERVE_SUCCESS != maj_err)
					frm.elements[PG_FLDNAME_OTP].value = ""; 
			}
		}
		// 2014-04-08 - Bad auth on change pw page left this field editable
		if (bStandAlonePWChange) {
			frm.elements[DEF_FLD_USERNAME].disabled = true;
		}
	} else {
		alert("checkError(): Blank response from PortalGuard agent!");
	}
}


function handleError(frm, root, thediv) {
	var fld = "", msg = "", msg2 = "";
	var	msg_hdr = "", msg_mid = "", msg_ftr = "";	// For displaying strings comprised of multiple minor errors
	var bSubmit = false;
	
	if (g_bSideCar) {
		try {
			var bBadUser = checkXMLCondition(root, PG_RET_BAD_USER);
			var bBadPW = checkXMLCondition(root, PG_RET_BAD_PASS);
			var bLockedOut = checkXMLCondition(root, PG_RET_STRUCKOUT);
			if (parent.suppressPG(bBadUser, bBadPW, bLockedOut)) {
				// 2013-06-07 - If self service failure, treat differently from bad password during login
				if ( (PGAPI_RC_SELFSERVE_FAILURE == getXMLElementNum(root, "maj_error") && g_bAlwaysShowSSErrorsInSidecar) ||
					  PGAPI_RC_CONFIRMEMAIL_FAILURE == getXMLElementNum(root, "maj_error") ) 
				{
					// 2013-06-11 - Don't close sidecar
				} else {
					parent.closeIframe(true);	// Iframe shouldn't be up, but this gives us a consistent interface
					return false;	// Do NOT submit from this code path
				}
			} else {
				if (DEBUG) alert("Calling parent.showIframe()");
				parent.showIframe();
			}
		} catch (e) {
			if (DEBUG) alert("Failed to call parent.showIframe()");
		}
	}
	
	try {
		var bGetAllPWRules = false;
		var maj_err = getXMLElementNum(root, "maj_error");
		var bTOU = (null == getXMLChildElement(root, "termsofuse") ? false : true);

		// 2017-01-04 - Access any pw quality rules immediately
		var root_pwqual = getXMLChildElement(root, "pwquality");
		if (typeof root_pwqual != "undefined") {
			g_bPremptivePWRules = ("1" == getXMLAttrNum(root_pwqual, "predsp") ? true : false);
			if (g_bPremptivePWRules)
				g_bRealtimePWQuality = ("1" == getXMLAttrNum(root_pwqual, "rtcheck") ? true : false);
		}

		// Check for CAPTCHA
		var root_captcha = getXMLChildElement(root, "recaptcha");
		if (root_captcha) {
			if (null == g_CAPTCHA) {
				g_CAPTCHA = new PG_CAPTCHA();
				// Only dynamically load the v2 JS file
				if (2 == getXMLAttrNum(root_captcha, "v")) {
					$.getScript("https://www.google.com/recaptcha/api.js?onload=cbRECAPTCHAv2OnLoad&render=explicit");
				}
			}
			g_CAPTCHA.key = getXMLElementStr(root_captcha, "pubkey");
			g_CAPTCHA.theme = getXMLElementStr(root_captcha, "theme");
			g_CAPTCHA.version = getXMLAttrNum(root_captcha, "v");
			if ("1" == getXMLElementStr(root_captcha, "valid"))
				propagateCAPTCHAResponse(frm);
		}
		// Reset auth type after CVC
		if (PG_AUTHTYPE_CUSTVOICECALL == AUTHTYPE)
			resetATAfterCustomVoiceCall();
		
		var atype = getXMLElementNum(root, "raa");
		var bOTPEnroll = (null == getXMLChildElement(root, "otp_enroll") ? false : true);
		if (bOTPEnroll && PG_ACCT_CHECKOTP != AUTHTYPE) {
			g_bNeedPhoneProvider = (1 == getXMLAttrNum(getXMLChildElement(root, "otp_enroll"), "needprovider") ? true : false);
			// 2012-11-02 - Countries are now coming from the server
			populateCountries(getXMLChildElement(getXMLChildElement(root, "otp_enroll"), "countries"));
			document.getElementById("OTPEnrollForm").elements["OTPEnrollType"].value = getXMLAttrStr(getXMLChildElement(root, "otp_enroll"), "type");
			document.getElementById("OTPEntryForm").elements["OTPEntryType"].value = getXMLAttrStr(getXMLChildElement(root, "otp_enroll"), "type");
		}
		
		// 2019-10-23 - Grouped 2FA enrollment
		if (null != getXMLChildElement(root, "grp2faenroll")) {
			bOTPEnroll = false;	// Ensures flow doesn't go right to phone enrollment
			var root_group = getXMLChildElement(root, "grp2faenroll");
			if (shouldDisplay2FAGroupChooser(root_group, root)) {
				create2FAGroupChooser(root_group, root);
				return;
			}			
		}

		var bOTPNeeded = (null == getXMLChildElement(root, "otp_needed") ? false : true);
		var root_otp = null;
		if (bOTPNeeded) {
			root_otp = getXMLChildElement(root, "otp_needed");
			document.getElementById("OTPEntryForm").elements["OTPEntryType"].value = getXMLElementStr(getXMLChildElement(root, "otp_needed"), "delivery");
		}
		var root_scoring = getXMLChildElement(root, "scoring");
		// 2012-04-25 - Checking selfserv state to determine if we're in the middle of a ss action
		var ss_state = (null == getXMLChildElement(root, "ss") ? 0 : getXMLAttrNum(getXMLChildElement(root, "ss"), "state"));
		// 2012-07-26 - Do not do the RBA stuff if this is a pw change
		// 2014-06-25 - With RBA, must still prompt for OTP enrollment accordingly
		if (atype > 0 && 0 == ss_state && PG_AUTHTYPE_SETPW != AUTHTYPE && !bOTPEnroll) {
			var bExit = true;
			
			switch (atype) {
			case AUTHTYPE_BLOCKED:
				showNoLogin();
				break;
			case AUTHTYPE_TWO_FACTOR:
				if (bOTPNeeded) {
					showOTPEntry(true, root_otp);
					// 2020-11-30 - Made a change in PG.dll v6.4.2.1 to return OTP methods even for a delivery error. These changes are to show the error.
					var root_min = getXMLChildElement(root, "min_errors")
					for (var i = 0; null != root_min && i < root_min.childNodes.length; i++) {
						var min_err = getXMLElementNum(root_min, "min_error", i);
						switch (min_err) {
							// 2020-11-30 - Only show an error for these specific errors (don't break other functionality, we *expect* PGAPI_RC_OTP_MISSING)
							case PGAPI_RC_SERVICE_MISCONFIGURED:
							case PGAPI_RC_SERVICE_ACCT_ISSUE:
							case PGAPI_RC_SERVICE_DELIVERY_FAILURE:
								bExit = false;
								// Ensure the error message goes in the correct div!
								setElemContent("", ["infoOTPEntry"]);	// Clear out any bogus instructions (e.g. "OTP was sent to phone xxx-1234")
								thediv = document.getElementById("ErrMsgOTPEntry");
								break;
						}
					}
				} else {
					alert("Two factor authentication error");
				}
				break;
			case AUTHTYPE_OTP:
				if (bOTPNeeded) {
					showOTPEntry(false, root_otp);
				} else {
					alert("OTP only authentication error");
				}					
				break;
			case AUTHTYPE_PW_AND_KBA:
				// If they have not enrolled, then we need to walk them through that first
				var	bNeedAnswers = false;
				var root_min = getXMLChildElement(root, "min_errors");
				var min_errs = getXMLAttrNum(root_min, "count");
				var fld = "", msg = "";
				for (var i = 0; i < min_errs; i++) {
					var min_err = getXMLElementNum(root_min, "min_error", i);
				
					if (PGAPI_RC_CHAL_ANSWERS_NOT_SET == min_err) {
						bNeedAnswers = true;
						msg = getNoRecoveryQuestionsSetMsg(g_bPGClient);
						showSSEnrollPopup(root);
						frm = document.getElementById("SSForm");
						thediv = document.getElementById("ErrMsgSS");
						break;
					}
				}
				
				// Otherwise, prompt for both the static pw and the answer to the random question
				if (!bNeedAnswers) {
					var root_chal = getXMLChildElement(root, "challenge");
					showLoginCAPopup(root_chal);
					frm = document.getElementById("LoginCAForm");
					thediv = document.getElementById("ErrMsgCA");
					fld = resolveField(DEF_FLD_PASSWORD + "1");
				}
				
				bExit = false;
				break;
			case AUTHTYPE_NAME_PASSWORD:
				// 2012-08-20 - If the logon was successful, let it slip down to normal switch() handler below
				if (PGAPI_RC_NONE == maj_err) {
					bExit = false;
				} else {
					// 2012-08-20 - Added explicit case for phone enrollment from CBA, otherwise UI sits on name/pw main form
					if (bOTPEnroll) {
						showOTPEnroll();
					} else if (bOTPNeeded) {
						showOTPEntry(true, root_otp);	// 2012-07-26 - Most likely this is phone enrollment so validate pw too
					} else {
						showStaticPWLogin();
						if (null != getXMLChildElement(root, "ss"))
							setElemVisibility(["btnSelfServe"], true);
					}
				}
				break;
			default:
				alert("Unimplemented auth type: " + atype);
				break;
			}
			
			if (bExit) {
				handleScoringDisplay(root_scoring);
				return;
			}
		}
		
		
		// 2012-07-24 - If they need to enroll a phone, do it regardless of any other elements
		// 2018-06-18 - ... unless it's app-specific 2FA (doesn't allow enrollment)
		if (bOTPEnroll && PG_ACCT_CHECKOTP != AUTHTYPE) {
			showOTPEnroll();
			return;
		}
		
		// 2018-05-21 - Undo the UI changes performed when Duo Push is initiated
		if (g_bDuoPushAttempted && "1" != getXMLElementStr(root, "duoasync")) {
			DuoPushHandler(false, frm, root);
		}
		if (g_bBKMobilePushAttempted && "1" != getXMLElementStr(root, "bkmasync")) {
			BKMobilePushHandler(false, frm, root);
		}		
		if (g_bAuthyPushAttempted && "1" != getXMLElementStr(root, "authyasync")) {
			AuthyPushHandler(false, frm, root);
		}		
		
		switch (maj_err) {
		case PGAPI_RC_NONE:
		case PGAPI_RC_CHECKLOGINANS_SUCCESS:
			if (bTOU)
				showTOUPopup();
			else
				bSubmit = true;
			break;

		case PGAPI_RC_PWCHANGE_SUCCESS:
			var root_pwauth = getXMLChildElement(root, "pwauth");
			msg = displayPWChangeStep(root, root_pwauth);
			break;		

		case PGAPI_RC_TOU_SUCCESS:
			bSubmit = true;
			break;

		case PGAPI_RC_FIDO2PWLESS_SUCCESS:
			// 2021-01-31 - Any minor error will not enter here, it will fall through to the normal handling below			
			var webauthn_chal = getXMLElementStr(root, "webauthn_chal");
			if (webauthn_chal.length > 0) {
				setElemContent(getInstrUseWebAuthnToken(), ["infoLogin"]);
				setTimeout(function() { displayWebAuthnAuthPrompt(frm, webauthn_chal, thediv.id); }, 100);
			} else {
				// Successful authentication
				bSubmit = true;
			}
			break;
				
		case PGAPI_RC_CHECKOTP_SUCCESS:
			completeMFAOTPEntry();
			break;
			
		case PGAPI_RC_SELFREG_FAILURE:
		case PGAPI_RC_SELFREG_SUCCESS:
		case PGAPI_RC_SELFREG_EMAILCONF_FAILURE:
		case PGAPI_RC_SELFREG_EMAILCONF_SUCCESS:
			msg = handleSelfReg(maj_err, root, frm);
			break;

		case PGAPI_RC_FORGOTUSER_FAILURE:
		case PGAPI_RC_FORGOTUSER_SUCCESS:
			msg = handleForgotUser(maj_err, root, frm);
			break;
						
		case PGAPI_RC_SELFSERVE_SUCCESS:
			var root_ss = getXMLChildElement(root, "ss");
			msg = displaySSStep(root, root_ss);
			break;
			
		case PGAPI_RC_ACCTLINK_SUCCESS:
			setElemContent("", ["infoAcctLink"]);
			msg = getSuccessfulAcctLinkMsg(true);
			setElemVisibility(["fldsAcctLink"], false);
			clearAcctLinkFields();
			setAuthType(PG_AUTHTYPE_NOENTERKEYSUBMIT);	// 2012-09-05
			break;
		
		case PGAPI_RC_CHANGEUSERNAME_SUCCESS:
			msg = displayChngUsrStep(getXMLChildElement(root, "chngusr"));
			break;
		
		case PGAPI_RC_CONFIRMEMAIL_SUCCESS:
			msg = "";
			closeEmailConf(false);
			bSubmit = true;
			break;
			
		case PGAPI_RC_CONFIRMPHONE_SUCCESS:
			msg = "";
			closePhoneConf(true);	// 2014-10-30 - Submit through login agent
			break;
			
		case PGAPI_RC_TOU_FAILURE:
			var url = getXMLElementStr(getXMLChildElement(root, "termsofuse"), "url");
			if (url.length > 0)
				window.location = url;
			break;

		case PGAPI_RC_GETOPTS_SUCCESS:
			if (bOTPNeeded) {
				// 2012-10-09 - This should never be reached - it should be handled above by the <raa> cases
				showOTPEntry(true, root_otp);
			} else if (AUTHTYPE_PW_AND_KBA == atype) {
				// Let it fall through to where the div and msg display is handled
			} else {
				// Just prompt for a normal password if nothing special is enabled
				showStaticPWLogin();
				if (null != getXMLChildElement(root, "ss"))
					setElemVisibility(["btnSelfServe"], true);
			}
			break;

		case PGAPI_RC_OPTENROLL_SUCCESS:
			//alert("In OTPENROLL_SUCCESS maj_err case");
			showOTPEntry(true, root_otp);
			break;

		case PGAPI_RC_OPTENTRY_SUCCESS:
			setElemVisibility(["blockUI", "popup_OTPEntry"], false);	// So adding the prefix below isn't visible, can't use closeAllPopups(): it resets authtype!
			clearMainFormErrors();
			// 2013-02-11 - For TOU display after manual OTP entry
			if (bTOU)
				showTOUPopup();
			else
				bSubmit = true;
			break;

		case PGAPI_RC_OFFLINERECOVERY_SUCCESS:
			setElemVisibility(["infoChal", "fldsChal_Creds", "btnsChal_Creds", "fldsChal_MandQs", "fldsChal_OptQs1", "fldsChal_OptQs2", "fldsChal_OptQs3", "btnsChal_Answers"], false);
			var thepw = getXMLElementStr(root, "recovered_password");
			msg = getOfflineRecoveryMsg(thepw);
			break;

		case PGAPI_RC_CUSTVOICECALL_SUCCESS:
			var conf = getXMLElementStr(root, "cvc_conf");
			msg = getCustVoiceCallSentMsg(conf);
			break;
		
		case PGAPI_RC_GENERAL_FAILURE:
		case PGAPI_RC_PG_UNAVAILABLE:
			msg = getGenErrorMsg();
			break;

		case PGAPI_RC_CAUGHT_EXCEPTION:
			msg = getExceptionMsg(getXMLElementData(root, "exception"));
			break;	

		// General cases here for all other errors
		default:
			// Loop over minor errors
			var bShowSetPW = false, bHadAsyncRetCode = false;
			var root_min = getXMLChildElement(root, "min_errors");
			var min_errs = getXMLAttrNum(root_min, "count");
			for (var i = 0; i < min_errs; i++) {
				var min_err = getXMLElementNum(root_min, "min_error", i);
				
				switch(min_err) {
				case PGAPI_RC_NO_USERNAME_SUPPLIED:
					fld = resolveField(DEF_FLD_USERNAME);
					msg = getBlankUserMsg();
					break;

				case PGAPI_RC_NO_PASSWORD_SUPPLIED:
					fld = resolveField(DEF_FLD_PASSWORD);
					msg = getBlankPwMsg();
					break;

				case PGAPI_RC_NO_NEWPW_SUPPLIED:
					fld = resolveField(DEF_FLD_NEWPW);
					msg = getBlankNewPwMsg();
					if (g_bPremptivePWRules && g_bRealtimePWQuality && g_objPWQuality)
						g_bRecreatePWQualMsg = true;
					break;

				case PGAPI_RC_NEWPWS_NOT_MATCH:
					if (g_bClearPWFieldsOnMismatch) {
						frm.elements[DEF_FLD_NEWPW].value = frm.elements[DEF_FLD_CONFPW].value = "";
					}
					fld = resolveField(DEF_FLD_NEWPW);
					msg = getMismatchedPwMsg();
					if (g_bPremptivePWRules && g_bRealtimePWQuality && g_objPWQuality)
						g_bRecreatePWQualMsg = true;
					break;
				
				case PGAPI_RC_NO_CAPTCHA:
					msg = getMissingCAPTCHAMsg();
					try {
						g_bFocusCAPTCHA = true;
					} catch (e) {}
					break;
					
				case PGAPI_RC_BAD_CAPTCHA:
					msg = getBadCAPTCHAMsg();
					try {
						Recaptcha.reload();
						g_bFocusCAPTCHA = true;
					} catch (e) {}
					break;
					
				case PGAPI_RC_NEED_USERNAME_CHANGE:
					showChngUsrPopup(getXMLChildElement(root, "chngusr"));
					break;
					
				case PGAPI_RC_NEED_EMAIL_CONFIRM:
					showEmailConfPopup(getXMLChildElement(root, "emailconf"));
					break;
					
				case PGAPI_RC_NEED_PHONE_CONFIRM:
					showPhoneConfPopup(getXMLChildElement(root, "phoneconf"));
					break;
				
				case PGAPI_RC_PWEXPIRED:
				case PGAPI_RC_PWEXPINGRACE:
					var root_exp = getXMLChildElement(root, "expiration");
					var expdays = getXMLElementNum(root_exp, "days_until");
					var gracedays = getXMLElementNum(root_exp, "days_grace");
					var firstlogin = getXMLElementNum(root_exp, "init_pw");

					msg = getExpiredPwMsg(expdays, gracedays);
					// On initial login with expired password, allow proceeding directly to "New Password" dialog skipping "PW Expired" msg.
					// Calling showSetPWPopup with a value of true will cause the auto submit
					showSetPWPopup( (1 == firstlogin ? g_SkipInitPWExpiredMsg : false) );

					frm = document.getElementById("SetPWForm");
					thediv = document.getElementById("ErrMsgSetPW");
					break;

				case PGAPI_RC_BAD_USER:
					fld = resolveField(DEF_FLD_USERNAME);
					msg = getInvalidUserMsg();
					break;
					
				case PGAPI_RC_TOO_MANY_MATCHES:
					fld = resolveField(DEF_FLD_USERNAME);
					msg = getMultipleUsersMsg();
					break;

				case PGAPI_RC_BAD_PASSWORD:
					fld = resolveField(DEF_FLD_PASSWORD);
					msg = getInvalidPwMsg();
					break;

				case PGAPI_RC_GENERIC_BAD_LOGIN:
					msg = getBadLoginMsg();
					break;

				case PGAPI_RC_NO_NEWUSER_SUPPLIED:
					msg = getNoNewUserMsg();
					fld = DEF_FLD_NEWUSERNAME;
					break;
					
				case PGAPI_RC_INVALID_NEWUSER:
					msg = getInvalidNewUserMsg();
					fld = DEF_FLD_NEWUSERNAME;
					break;
					
				case PGAPI_RC_UNUSABLE_NEWUSER:
					msg = getUnusableNewUserMsg();
					fld = DEF_FLD_NEWUSERNAME;
					break;
					
				case PGAPI_RC_STRIKE:
				case PGAPI_RC_ACCOUNT_STRUCKOUT:
				case PGAPI_RC_BAD_CHAL_ANSWER:
				case PGAPI_RC_OTP_STRIKE:
					var root_lockout = getXMLChildElement(root, "lockout");
					var strikes = getXMLElementNum(root_lockout, "strikes");
					var strikesleft = getXMLElementNum(root_lockout, "strikesleft");
					var expSecs = getXMLElementNum(root_lockout, "exp_secs");

					if (PGAPI_RC_BAD_CHAL_ANSWER == min_err) {
						msg = getWrongRecoverAnswerProvidedMsg(strikes, strikesleft, expSecs);
					} else if (PGAPI_RC_OTP_STRIKE == min_err) {
						msg = getBadOTPMsg(strikes, strikesleft, expSecs);
						fld = PG_FLDNAME_OTP;
						if (PGAPI_RC_LOGIN_FAILED == maj_err)				// 2014-08-28 - Only an RSA passcode entered on the login form
							fld = resolveField(DEF_FLD_PASSWORD);
					} else {
						if (PGAPI_RC_ACCOUNT_STRUCKOUT == min_err)
							fld = "";	// No field to put focus in...
						else
							fld = resolveField(DEF_FLD_PASSWORD);
						msg = getStrikeoutMsg(strikes, strikesleft, expSecs);
					}
					break;

				case PGAPI_RC_ACCOUNT_DISABLED:
					msg = getAccoutDisabledMsg();
					break;

				case PGAPI_RC_ACCOUNT_EXPIRED:
					msg = getAccountExpiredMsg();
					break;

				case PGAPI_RC_PWCHANGE_DISABLED:
					msg = getPWChangeDisabledMsg();
					break;

				case PGAPI_RC_RECOVERY_LOCKED:
					// 2016-03-29 - Fix for non-existent JS popups
					setElemVisibility(["infoSS", "fldsSS", "fldsChal_MandQs", "fldsChal_OptQs1", "fldsChal_OptQs2", "fldsChal_OptQs3"], false);
					msg = getLockedERBMsg();
					break;

				case PGAPI_RC_PW_TOO_SHORT:
				case PGAPI_RC_PW_TOO_LONG:
				case PGAPI_RC_PW_INSUFF_LCASE:
				case PGAPI_RC_PW_INSUFF_UCASE:
				case PGAPI_RC_PW_INSUFF_NUMERIC:
				case PGAPI_RC_PW_INSUFF_SPECIAL:
				case PGAPI_RC_PW_AD_COMPLEXITY:
				case PGAPI_RC_PW_INSUFF_SCORE:
					fld = resolveField(DEF_FLD_NEWPW);
					bShowSetPW = true;
					// 2011-10-31 - Is rule grouping enabled?
					var root_grp = getXMLChildElement(getXMLChildElement(root, "pwquality"), "pwgroup");
					var grp_floor = getXMLAttrNum(root_grp, "rule");
					if (DEBUG)
						alert("PW group floor count: " + grp_floor);

					msg_hdr = getPWComplexityHdr(grp_floor);
					msg_mid = getPWComplexityMid(grp_floor);
					msg_ftr = getPWComplexityServerSide(root) + getPWComplexityFtr(grp_floor);	// 2019-02-18 - Server side rules display before footer
					if (g_bShowAllPWRules) {
						bGetAllPWRules = true;
					} else {
						var bGrouped = new wrapbool();
						var tmp = getSinglePWRuleMsg(root_grp, min_err, null, bGrouped);
						if (bGrouped.value)
							msg2 = msg2 + tmp;
						else
							msg  = msg + tmp;
					}
					break;

				// 2016-12-20 - Start of server-side pw checks
				case PGAPI_RC_PW_PREVIOUSLY_USED:
					fld = resolveField(DEF_FLD_NEWPW);
					msg = getPreviousPasswordMsg();
					if (g_bPremptivePWRules && g_bRealtimePWQuality && g_objPWQuality)
						g_bRecreatePWQualMsg = true;
					break;
				
				case PGAPI_RC_PW_DICTIONARY_HIT:
					fld = resolveField(DEF_FLD_NEWPW);
					msg = getNoDictionaryWordsMsg();
					if (g_bPremptivePWRules && g_bRealtimePWQuality && g_objPWQuality)
						g_bRecreatePWQualMsg = true;
					break;
				
				case PGAPI_RC_PW_INSUFF_DIFFCHARS:
					fld = resolveField(DEF_FLD_NEWPW);
					msg = getPWMinimumDiffCharsMsg(getXMLAttrNum(getXMLChildElement(root, "pw_diffchars"), "rule"));;
					if (g_bPremptivePWRules && g_bRealtimePWQuality && g_objPWQuality)
						g_bRecreatePWQualMsg = true;
					break;
										
				case PGAPI_RC_PW_REGEX_FAILURE:
					fld = resolveField(DEF_FLD_NEWPW);
					msg = getXMLElementStr(getXMLChildElement(root, "pwquality"), "pwregex");	// Display msg comes from config
					if (g_bPremptivePWRules && g_bRealtimePWQuality && g_objPWQuality)
						g_bRecreatePWQualMsg = true;
					break;

				case PGAPI_RC_PW_TOO_YOUNG:
					msg = getPWTooYoungMsg(getXMLElementNum(root, "pw_minage"));
					break;
				// 2016-12-20 - End of server-side pw checks
					
				case PGAPI_RC_CHAL_ANSWER_NOT_COMPLEX:
					msg = getAnswerInsufficientlyComplexMsg(ANSWER_MIN_LEN);
					break;

				case PGAPI_RC_REPEATED_ANSWER:
					msg = getRepeatedAnswerMsg();
					break;

				case PGAPI_RC_ANS_CONTAINS_QWORD:
					msg = getAnswerIsQuestionWordMsg();
					break;

				case PGAPI_RC_INACTIVITY_LOCKOUT:
					var root_lockout = getXMLChildElement(root, "lockout");
					var inactivedays = getXMLElementNum(root_lockout, "inactivity_thresh");
					msg = getInactivityLockoutDaysMsg(inactivedays);
					break;

				case PGAPI_RC_BLANK_CHAL_ANSWER:
					// 2012-08-31 (SSPM-9) - Allowing user to cancel action if they somehow selected an invalid auth type or ordering
					try {
						if (null == g_objCQA) {
							// 2014-01-30 - See what answer is blank
							for (var i = 1; i <= MAX_CHALLOGIN_ANS; i++) {
								var fldname = DEF_FLD_LOGINANS + i;
								if (0 == frm.elements[fldname].value.length) {
									fld = fldname;
									break;
								}
							}
							msg = getBlankChallengeAnswer();
						} else {
							if (g_objCQA.bSetCQA) {
								msg = getBlankSetAnsProvidedMsg(g_objCQA.nMandQs, g_objCQA.nOptQs, g_objCQA.nOptShares);
							} else {
								msg = getBlankResetAnsProvidedMsg(g_objCQA.nMandQs, g_objCQA.nOptShares, g_objCQA.nOptThreshold);
							}
						}
					} catch(e) {
						msg = getSSAuthNotAvailable();
					}
					break;

				case PGAPI_RC_CHAL_ANSWERS_NOT_SET:
				case PGAPI_RC_RECOVERY_BLOB_MISSING:
				case PGAPI_RC_RECOVERY_INVALID:
				case PGAPI_RC_SELFSERV_NEED_ENROLL:
					var bOffline = (null == getXMLChildElement(root, "offline") ? false : true);
					if (PGAPI_RC_CHAL_ANSWERS_NOT_SET == min_err) {
						if (g_bPGClient) {	// Not sure how this is affected yet
							msg = getNoRecoveryQuestionsSetMsg(g_bPGClient);
							break;
						}
					} else if (PGAPI_RC_RECOVERY_BLOB_MISSING == min_err)
						msg = getMissingERBMsg(bOffline);
					else if (PGAPI_RC_RECOVERY_INVALID == min_err)
						msg = getInvalidERBMsg(bOffline);
					if (bOffline)
						break;
					showSSEnrollPopup(root);
					frm = document.getElementById("SSForm");
					thediv = document.getElementById("ErrMsgSS");
					break;

				case PGAPI_RC_REPOSITORY_NEED_LINK:
					showAcctLinkPopup(root);
					frm = document.getElementById("AcctLinkForm");
					thediv = document.getElementById("ErrMsgAcctLink");
					break;
					
				case PGAPI_RC_PW_SYNC_FAILURE:
					msg = getInitialPWSyncFailureMsg();
					break;
					
				case PGAPI_RC_NEED_MOBILEAPP_ENROLL:
					showMobileAppPopup(root);
					frm = document.getElementById("MobileAppForm");
					thediv = document.getElementById("ErrMsgMobileApp");
					break;
					
				case PGAPI_RC_CHAL_RECOVERY_NOT_ENABLED:
					msg = getChalRecoveryNotEnabledMsg();
					break;

				case PGAPI_RC_TRIAL_EXPIRED:
					msg = getLicenseExpiredMsg();
					break;

				case PGAPI_RC_UNLICENSED_FEATURE:
					msg = getUnlicensedMsg();
					break;
					
				case PGAPI_RC_LOGIN_REQUIRES_CHAL:
					var root_chal = getXMLChildElement(root, "challenge");
					showLoginCAPopup(root_chal);
					frm = document.getElementById("LoginCAForm");
					thediv = document.getElementById("ErrMsgCA");
					fld = resolveField(DEF_FLD_LOGINANS + "1");
					break;

				case PGAPI_RC_TOO_MANY_SESSIONS:
					msg = getSessionPreventedMsg();
					break;

				case PGAPI_RC_OTP_BAD_PHONE:
					var fmt = getXMLElementStr(root, "phone_format");
					msg = getBadPhoneMsg(fmt);
					fld = PG_FLDNAME_PHONE;
					break;
					
				case PGAPI_RC_NO_PHONE:
					msg = getNoPhoneFoundMsg();
					break;
					
				case PGAPI_RC_BAD_USER_DATA:
					msg = getBadUserDataMsg();
					break;
				
				case PGAPI_RC_BAD_ADMIN:
					msg = getBadAdminMsg();
					break;
					
				case PGAPI_RC_OTP_BAD_PROVIDER:
					msg = getBadPhoneProviderMsg();
					fld = PG_FLDNAME_PHONE_PROVIDER;
					break;

				case PGAPI_RC_PHONE_DUPLICATE:
					msg = getDuplicatePhoneMsg();
					fld = PG_FLDNAME_PHONE;
					break;
					
				case PGAPI_RC_EMAIL_BAD_FORMAT:
					msg = getBadEmailFormatMsg();
					fld = PG_FLDNAME_EMAIL;
					if (PGAPI_RC_CHANGEUSERNAME_FAILURE == maj_err)
						fld = DEF_FLD_NEWUSERNAME;
					break;
					
				case PGAPI_RC_EMAIL_BAD_DOMAIN:
					msg = getBlockedEmailDomainMsg();
					fld = PG_FLDNAME_EMAIL;
					if (PGAPI_RC_CHANGEUSERNAME_FAILURE == maj_err)
						fld = DEF_FLD_NEWUSERNAME;
					break;

				case PGAPI_RC_UNUSABLE_EMAIL:
					msg = getEmailUnavailableMsg();
					fld = PG_FLDNAME_EMAIL;
					break;
				
				case PGAPI_RC_UNUSABLE_PASSWORD:
					msg = getPasswordUnavailableMsg();	// User cannot login, must reset pw
					break;
					
				case PGAPI_RC_OTP_MISSING:
					msg = getMissingOTPMsg();
					fld = PG_FLDNAME_OTP;
					break;

				case PGAPI_RC_OTP_BAD:
					msg = getBadOTPMsg(0, 0, 0);	// No strike information
					fld = PG_FLDNAME_OTP;
					break;

				case PGAPI_RC_OTP_EXPIRED:
					msg = getExpiredOTPMsg();
					fld = PG_FLDNAME_OTP;
					break;

				case PGAPI_RC_OTP_NOT_SENT:
					msg = getOTPNotSentMsg();
					break;
					
				case PGAPI_RC_OTP_RESENT:
					clearOTPResendFlag(frm);
					var root_otp = getXMLChildElement(root, "otp_needed");
					var delivery = getXMLElementNum(root_otp, "delivery");
					var fidou2f_chal = getXMLElementStr(root_otp, "fidou2f_chal");	// 2018-11-29 - May be blank
					var webauthn_chal = getXMLElementStr(root_otp, "webauthn_chal");	// 2019-05-06 - May be blank
					msg = getOTPResentMsg(delivery);	// 2019-01-25 - Re-added delivery param
					fld = PG_FLDNAME_OTP;
					// 2016-01-19 - Hide ext auth for OTP resend
					try {
						setElemVisibility(["fldOTPEntryOTP", "fldSSOTP", "fldSetPWOTP"], true);
						frm[PG_FLDNAME_OTP].value = "";
						hideExtAuth(); 
					} catch (e) {}
					
					// 2018-11-29 - FIDO U2F resend
					if (PG_OTP_DELIVERY_FIDOU2F == delivery && fidou2f_chal.length > 0) {
						setTimeout(function() { displayFIDOU2FAuthPrompt(frm, fidou2f_chal, thediv.id); }, 1000);
						msg = "";
					}
					// 2019-05-06 - WebAuthn resend
					if (PG_OTP_DELIVERY_WEBAUTHN == delivery && webauthn_chal.length > 0) {
						setTimeout(function() { displayWebAuthnAuthPrompt(frm, webauthn_chal, thediv.id); }, 1000);
						msg = "";
					}
                    // 2019-06-20 - WEB-key resend
					if (PG_OTP_DELIVERY_WEBKEY == delivery) {
						doWEBkey(frm, thediv);	// 2020-04-24 - Passing element instead of id!
						msg = "";
					}

					break;
					
				case PGAPI_RC_OTP_RESEND_TOO_SOON:
					clearOTPResendFlag(frm);
					var root_otp = getXMLChildElement(root, "otp_needed");
					var root_resend = getXMLChildElement(root_otp, "resend");
					var secsremain = getXMLAttrNum(root_resend, "wait");
					msg = getOTPResendTooSoon(secsremain);
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_OTP_SMS_UNSUPPORTED:
					clearOTPResendFlag(frm);
					msg = getPhoneDoesNotSupportSMS();
					break;

				case PGAPI_RC_OTP_NEED_ENROLLMENT:
					msg = getNoOTPEnrolledMsg();
					setElemVisibility(["fldsOTPEntryOTP"], false);
					$("#btnOTPEntryLogin").prop('disabled', true);
					$("#btnOTPEntryCancel").prop('disabled', true);
					break;
					
				case PGAPI_RC_ACTIVATION_EXPIRED_SESS:
					msg = getActivationSessionExpiredMsg();
					break;
					
				case PGAPI_RC_TOKEN_NOT_ENROLLED:
					msg = getTokenNotEnrolledMsg();
					break;
					
				case PGAPI_RC_TOKEN_OTP_REPLAYED:
					msg = getTokenOTPReplayedMsg();
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_FIDO2_PWLESS_UNAVAILABLE:
					msg = getFIDO2PWLessUnavailable();
					setAuthType(PG_AUTHTYPE_LOGIN);	// 2021-01-31: Revert enter key submit behavior
					break;
					
				case PGAPI_RC_FIDO2_PWLESS_UNENROLLED:
					msg = getFIDO2PWLessUnenrolled();
					setAuthType(PG_AUTHTYPE_LOGIN);	// 2021-01-31: Revert enter key submit behavior
					break;
					
				case PGAPI_RC_DUOPUSH_DENIED:
					msg = getDuoPushDeniedMsg();
					fld = PG_FLDNAME_OTP;
					break;
				
				case PGAPI_RC_DUOPUSH_NOT_ENROLLED:
					var enrollURL = getXMLElementStr(getXMLChildElement(root, "duo"), "enrollURL");
					msg = getDuoPushNotEnrolledMsg(enrollURL);
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_DUOPUSH_TIMEDOUT:
					msg = getDuoPushTimedOutMsg();
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_DUOPUSH_UNKNOWN_ERR:
					msg = getDuoPushUnknownErrorMsg();
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_DUOPUSH_REQ_INVALID:
					msg = getDuoPushRequestInvalidMsg();
					fld = PG_FLDNAME_OTP;
					break;
				
				case PGAPI_RC_BKMOBILE_DENIED:
					msg = getBKMobilePushDeniedMsg();
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_BKMOBILE_NOT_ENROLLED:
					msg = getBKMobileNotEnrolledMsg();
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_BKMOBILE_TIMEDOUT:
					msg = getBKMobileTimedOutMsg();
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_BKMOBILE_UNKNOWN_ERR:
					msg = getBKMobileRequestInvalidMsg();
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_BKMOBILE_REQ_INVALID:
					msg = getBKMobileUnknownErrorMsg();
					fld = PG_FLDNAME_OTP;
					break;
				
				case PGAPI_RC_AUTHY_DENIED:
					msg = getAuthyPushDeniedMsg();
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_AUTHY_TIMEDOUT:
					msg = getAuthyPushTimedOutMsg();
					fld = PG_FLDNAME_OTP;
					break;
				
				case PGAPI_RC_AUTHY_REQ_INVALID:
					msg = getAuthyPushRequestInvalidMsg();
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_RSA_INIT_FAILURE:
					msg = getRSANotInitializedMsg();
					break;
					
				case PGAPI_RC_RSA_SERVER_DOWN:
					msg = getRSAServerDownMsg();
					break;
					
				case PGAPI_RC_RSA_MEM_INVALID:
					msg = getRSAInternalErrorMsg();
					break;
					
				case PGAPI_RC_RSA_NEXT_CODE_REQ:
					msg = getRSANextCodeRequiredMsg();
					fld = PG_FLDNAME_OTP;
					break;
					
				case PGAPI_RC_RSA_NEW_PIN_REQ:
					msg = getRSANewPINRequiredMsg();
					break;
				
				case PGAPI_RC_RSA_BAD_USER_SYNTAX:
					msg = getRSABadUsernameSyntaxMsg();	// Too late for them to change the username(?)
					break;
					
				case PGAPI_RC_RSA_BAD_CODE_SYNTAX:
					msg = getRSABadPasscodeSyntaxMsg();
					fld = PG_FLDNAME_OTP;
					break;

				case PGAPI_RC_AUTH_SERVER_UNAVILABLE:
					msg = getServerDownMsg();
					break;

				case PGAPI_RC_UNSUPPORTED_FEATURE:
					msg = getUnsupportedMsg();
					break;
					
				case PGAPI_RC_EMAIL_FAILURE:
					msg = getGenEmailErrorMsg();
					break;

				case PGAPI_RC_LDAP_DSA_UNWILLING_SSL:
					msg = getLDAPUnwillingToPerformMsg();
					break;
	
				case PGAPI_RC_DB_UNAVAILABLE:
					msg = getDBConnectErrorMsg();
					break;
					
				case PGAPI_RC_AD_STRONG_AUTH_REQD:
					msg = getLDAPStrongAuthRequiredMsg();
					break;
					
				case PGAPI_RC_IDENG_UNKNOWN:
					msg = getIDEngUnknownError();
					break;

				case PGAPI_RC_RBA_UNSUPPORTED:
					msg = getRBAUnsupportedError();
					break;
					
				case PGAPI_RC_SELFSERV_NOT_ENABLED:
					msg = getSelfServiceNotAvailableMsg();
					break;
					
				case PGAPI_RC_SELFSERV_NOT_ENROLLED:
					msg = getSelfServiceNotEnrolled();
					break;
					
				case PGAPI_RC_SSAUTH_NOT_AVAILABLE:
					msg = getSSAuthNotAvailable();
					break;
					
				case PGAPI_RC_BAD_REQUEST_TYPE:
					msg = getBadRequestMsg();
					break;
					
				case PGAPI_RC_CONFIG_ERROR:
					msg = getConfigErrorMsg();
					break;
					
				case PGAPI_RC_INTERNAL_ERROR:
					msg = getInternalErrorMsg();
					break;

				case PGAPI_RC_DOCUMENT_NOT_SAVED:
					msg = getDocumentNotSavedMsg();
					break;

				case PGAPI_RC_NOT_INITIALIZED:
				case PGAPI_RC_UNKNOWN:
					msg = getGenErrorMsg();
					break;
					
				case PGAPI_RC_SERVICE_MISCONFIGURED:
					msg = getHostedSvcMisconfiguredMsg();
					break;
					
				case PGAPI_RC_SERVICE_DELIVERY_FAILURE:
					msg = getHostedSvcDeliveryFailedMsg();
					break;
					
				case PGAPI_RC_SERVICE_ACCT_ISSUE:
					msg = getHostedSvcAccountIssueMsg();
					break;
					
				case PGAPI_RC_SMS_UNSUPPORTED:
					msg = getSMSDeliveryUnsupportedMsg();
					break;

				case PGAPI_RC_VOICE_UNSUPPORTED:
					msg = getVoiceDeliveryUnsupportedMsg();
					break;

	            case PGAPI_RC_LANYARD_NOT_ISSUED:
					msg = getLanyardNotIssuedMsg();
					break;

	            case PGAPI_RC_LANYARD_LOGIN_NOT_ALLOWED:
					msg = getLanyardLoginNotAllowedMsg();
					break;

	            case PGAPI_RC_LANYARD_LOGIN_FAILED:
					msg = getLanyardLoginFailedMsg();
					break;
					
				case PGAPI_RC_OPERATION_PENDING:
					var txid = getXMLElementStr(root, "txid");
					if (null == g_objAsyncCtrl) {
						g_objAsyncCtrl = new PG_AsyncController(txid, frm, thediv);
					}
					
					// 2020-05-01 - Handling initial auth attempts for secondary actions
					i = min_errs;	// Prevents us from displaying info on any secondary minor errors (e.g. 1415 for SSPR)
					bHadAsyncRetCode = true;
					var iter = g_objAsyncCtrl.tryAgain(function() { enterKeySubmit(); });
					if (0 != iter) {
						// Block the UI until the full timeout or cancel occurs!
						toggleInputFields(frm, true);
						var bIsDuoAsync = ("1" == getXMLElementStr(root, "duoasync"));
						var bIsBKMobileAsync = ("1" == getXMLElementStr(root, "bkmasync"));
						var bIsAuthyAsync = ("1" == getXMLElementStr(root, "authyasync"));
						if (bIsDuoAsync || bIsBKMobileAsync || bIsAuthyAsync) {
							var interval = getXMLElementNum(root, "poll");
							var maxwait = getXMLElementNum(root, "maxwait");
							g_objAsyncCtrl.delay = interval;
							g_objAsyncCtrl.maxTries = maxwait / interval;							
							
							msg = getAsyncPushProgressMsg(iter, maxwait/1000);
							
							// Custom cleanup function on cancel
							g_objAsyncCtrl.customCancel = function() {
								// 2021-04-17 - For multi-step ops that have a step after BKM auth
								if (arguments[0] !== undefined) {
									//root = arguments[0];
									// Don't call the handlers below a 2nd time, they've already been called before the min_err loop. Doing so clears out the OTP field
								} else {
									if (bIsDuoAsync) { 
										DuoPushHandler(false, frm, root);
									} else if (bIsBKMobileAsync) {
										BKMobilePushHandler(false, frm, root);
									} else if(bIsAuthyAsync){
										AuthyPushHandler(false, frm, root);
									}
								}
								setElemContentDirect(getAsyncPushCancelledMsg(), thediv);
								setElemContent("", ["infoOTPEntry"]);
							};
						} else {
							msg = getAsyncOpProgressMsg(iter, g_objAsyncCtrl.maxTries);
						}
					} else {
						msg = getAsyncOpFailedMsg();
						toggleInputFields(frm, false);
						delete g_objAsyncCtrl;
						g_objAsyncCtrl = null;
					}					
					break;
					
				case PGAPI_RC_OPERATION_FAILED:
					msg = showError("", "The asynchronous operation failed on the back-end");
					break;
					
				case PGAPI_RC_OPERATION_CANCELLED:
					msg = showError("", "The asynchronous operation was cancelled on the back-end");
					break;
					
				default:
					msg = getGenErrorMsg(min_err);
					break;	
				}	// switch(min_err)
			}	// for (var i = 0; i < min_errs; i++)

			if (bGetAllPWRules) {
				var root_rule = getXMLChildElement(root, "pwquality");
				// Need to get child element and determine if the rule was met or not
				var kids = root_rule.childNodes;
				for (i = 0; i < kids.length; i++) {
					var	bGrouped = new wrapbool();
					var tmp = getSinglePWRuleMsg(root_rule, 0, kids[i].nodeName, bGrouped);
					if (bGrouped.value)
						msg2 = msg2 + tmp;
					else
						msg = msg + tmp;
				}
				// 2020-03-25 - Ensure this rule is shown if they submit a pw change/reset w/o having satisfied all the rules
				if (g_bInlineIISIllegalCharsPWRule) {
					msg = msg + getIISIllegalCharsMsg();
				}
			}
				
			if (bShowSetPW) {
				// Only need to display popup if on main logon form
				if (PG_AUTHTYPE_LOGIN == AUTHTYPE) {
					showSetPWPopup(false);
					frm = document.getElementById("SetPWForm");
					thediv = document.getElementById("ErrMsgSetPW");
				}
			}
		}	// switch (maj_err)

		if (isLanyardLogin()) {
			setTimeout(function() { try { setElemContent("", ["ErrMsgLogin"]); requestAnimationFrame(frameCap); } catch (e) { formatException("handleError() - Caught exception", e); }}, PG_LL_RELOGIN_TIME);
		}
		
		// Only selecting a field and printing the error message after processing all minor errors
		if (fld.length > 0) {
			try {
				eval("frm." + fld + ".focus();");
				eval("frm." + fld + ".select();");
				eval("frm." + fld + ".className='" + g_defInputClass + " errorfield';");
			} catch (e) {}
		}

		if (g_CAPTCHA) {
			try {
				if (2 == g_CAPTCHA.version) {
					// 2019-01-02 - Fix for reCAPTCHA on secondary pages
					showRecaptcha(!g_CAPTCHA.v2OK, false);
				}
			} catch (e) {}
		}

		// 2021-05-07 - Only call the func below if an async op was actually being attempted (ensure normal ops aren't aborted)
		// 2020-05-01 - Clears out any txid so it doesn't get used by subsequent actions during this browser session
		// 2021-04-17 - For multi-step ops that use BKM, need to ensure state is maintained (e.g. OTP field isn't cleared during PW reset)
		//	So we're passing in the results for reference in the customCancel func that's called
		if (g_objAsyncCtrl && !bHadAsyncRetCode) { cancelAsyncOp(root); }

		// Prints the error message -OR- clears any current error
		if (msg_hdr.length > 0 || msg_ftr.length > 0)
			msg = msg_hdr + msg + msg_mid + msg2 + msg_ftr;
		setElemContentDirect(msg, thediv);
		// 2015-12-30 - To prevent screen "jumping" in responsive UI
		/*if (msg.length > 0)
			thediv.scrollIntoView(true);*/

		if (bGetAllPWRules) {
			// 2016-12-21 - Handles case when they submit a new password that wasn't complex enough
			//	This must be called *after* the msg has been written and the DOM has been updated
			if (g_bPremptivePWRules && g_bRealtimePWQuality) {
				initRealtimePWQuality(root, root_pwauth);
				g_objPWQuality.check(frm.NewPassword.value);
			}
		}
		
		if (PG_AUTHTYPE_OTPENTRY == AUTHTYPE) {
			var voicePhrase = document.getElementById("VoicePhrase");
			
			if ((null != voicePhrase) && (voicePhrase.value.length != 0)) {
				// This is a voice biometrics authentication, disable the Login button in case the voice verification failed.
				// The Login button is not used for voice biometrics.
				var loginButton = document.getElementById("btnOTPEntryLogin");
				if (null != loginButton) {
					loginButton.disabled = true;
				}
			}
		}
		
		handleScoringDisplay(root_scoring);
	} catch (e) {
		console.log(formatException("handleError()", e));
	}
		
	return bSubmit;
}


/*******************************************************************************/
/* PW CHANGES */
/*******************************************************************************/
function setSetPWResendInfo(root, root_pwauth) {
	var root_otp = getXMLChildElement(root, "otp_needed");
	var root_pwotp = getXMLChildElement(root_pwauth, "otp");
	var authtype = 0;
	if (null != root_pwotp)
		authtype = getXMLAttrNum(root_pwotp, "type");
		
	if (null != root_otp) {
		var delivery = getXMLElementNum(root_otp, "delivery");
		var conf = getXMLElementStr(root_otp, "conf");
		// Populate the hidden div with the resend HTML
		setElemContent(getOTPMethodsHTML(root_otp, "SetPWForm", "submitSetPW()", "popup_SetPW"), ["popup_OTPResend"]);

		var theurl = "<a href='javascript:displayOTPResendPopup()'>" + getResendOTPLinkText(delivery) + "</a>";
		setElemContent(theurl, ["spnResendSetPW"]);
	}
}


function showSetPWPopup(bAutoSubmitOK) {
	closeAllPopups();
	clearMainFormErrors();
	setAuthType(PG_AUTHTYPE_SETPW);
	var frmDest = document.getElementById("SetPWForm");
	
	try {
		doPopup("popup_SetPW");
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		// 2012-05-22 - Allowing first "Set Password" form to be auto-submitted
		if (g_SetPW_CopyPWFromParent) {
			frmDest.elements[DEF_FLD_PASSWORD].value = frmMainDisplay.elements[FLD_DSP_PASS].value;
		}
	
		try {	// Field may not be visible
			frmDest.elements[DEF_FLD_USERNAME].focus();
		} catch (e) {}
		
		frmDest.elements[PG_FLDNAME_PWCHANGESTEP].value = "1";
		frmDest.elements[DEF_FLD_LOGINANS + "1"].value = frmDest.elements[DEF_FLD_LOGINANS + "2"].value = frmDest.elements[DEF_FLD_LOGINANS + "3"].value = frmDest.elements[DEF_FLD_LOGINANS + "4"].value = frmDest.elements[DEF_FLD_LOGINANS + "5"].value = "";
		frmDest.elements[PG_FLDNAME_OTP].value = frmDest.elements[DEF_FLD_NEWPW].value = frmDest.elements[DEF_FLD_CONFPW].value = "";
		frmDest.elements[DEF_FLD_USERNAME].className = frmDest.elements[DEF_FLD_PASSWORD].className = frmDest.elements[DEF_FLD_NEWPW].className = frmDest.elements[DEF_FLD_CONFPW].className = g_defInputClass;

		// 2012-07-26 - For multi-auth pw changes
		resetPWChangeDialog();
		
		// 2011-12-02 - Auto-submit if set to use multi-step pw change
		// 2012-01-18 - Commented out for clarity
		// 2012-07-25 - Brought back auto-submit to reduce number of required steps/dialogs when possible
		if (bAutoSubmitOK && frmDest.elements[DEF_FLD_USERNAME].value.length > 0) {
			if (frmDest.elements[DEF_FLD_PASSWORD].value.length > 0) {
				// 2015-03-12 - Need to unhide the password field if configured to pull the pw from the parent form -AND- it is incorrect
				setElemVisibility(["fldsSetPWCurPW"], true);
			}
			submitSetPW();
		}
	} catch(e) {
		alert(formatException("showSetPWPopup()", e));
	}
}


function resetPWChangeDialog() {
	document.getElementById("UsernameSetPW").disabled = false;
	setElemVisibility(["fldsSetPW"], true);
	setElemVisibility(["fldsSetPWCurPW", "fldsSetPWChalA", "fldsSetPWOTP", "fldsSetPWNewPW"], false);
	setElemVisibility(["divSetPWCA2", "divSetPWCA3", "divSetPWCA4", "divSetPWCA5"], false);
	setElemContent(getPWChangeInstr(), ["infoSetPW"]);
	setElemContent("", ["ErrMsgSetPW"]);
}


function closeSetPW(bSubmit) {
	resetPWChangeDialog();
	document.getElementById("SetPWForm").elements["PWChangeStep"].value = "1";
	// 2012-01-09 - Ternary operator to prevent browser from automatically closing for PG Client
	closePopup("popup_SetPW", false, (g_bNoPGDBrowserClose ? false : g_bSideCar), PG_AUTHTYPE_LOGIN);
	
	if (bSubmit)
		submitLogin();
}


function displayPWChangeStep(root, root_pwauth) {
	var msg = "";	// Let the main loop handle updating the error div
	try {
		resetPWChangeDialog();
	
		var frm = document.getElementById("SetPWForm");
		var step = frm.elements[PG_FLDNAME_PWCHANGESTEP];
		var bComplete = (1 == getXMLAttrNum(root_pwauth, "complete") ? true : false);
		var root_pw = getXMLChildElement(root_pwauth, "pw");
		var root_chal = getXMLChildElement(root_pwauth, "challenge");
		var root_otp = getXMLChildElement(root_pwauth, "otp");
		var bReqPW = (null == root_pw ? false : true);
		var bReqChal = (null == root_chal ? false : true);
		var bReqOTP = (null == root_otp ? false : true);
		
		// Always disable the username field once in this process
		frm.elements[DEF_FLD_USERNAME].disabled = true;
		
		if (bComplete) {
			setElemContent("", ["infoSetPW"]);
			setElemVisibility(["fldsSetPW"], false);
			setMainFields(frm, "", DEF_FLD_NEWPW);
			msg = getSuccessfulPWChangeMsg(true, root);
			// 2012-07-25 - Prevent enter key submit
			setAuthType(PG_AUTHTYPE_NOENTERKEYSUBMIT);
			return msg;	
		}
		
		if (bReqPW) {
			step.value = "2";
			if (1 != getXMLAttrNum(root_pw, "verified")) {
				setElemVisibility(["fldsSetPWCurPW"], true);
				frm.elements[DEF_FLD_PASSWORD].focus();
				setElemContent(getPWChangeCurPWInstr(), ["infoSetPW"]);
				return msg;
			}
		}
		
		if (bReqChal) {
			step.value = "3";
			if (1 != getXMLAttrNum(root_chal, "verified")) {
				setElemVisibility(["fldsSetPWChalA"], true);
				setElemContent(getPWChangeChalAInstr(), ["infoSetPW"]);
				
				var root_chal = getXMLChildElement(root, "challenge");
				// 2014-01-30 - Need to handle dynamic creation (or unhiding?) of question labels and fields
				var root_qs = getXMLChildElement(root_chal, "required_for_login");
				// Hide all of the "extras" by default
				for (var i = 2; i <= MAX_CHALLOGIN_ANS; i++)
					setElemVisibility(["divSetPWCA" + i], false);
					
				for (var i = 0; i < root_qs.childNodes.length; i++) {
					setElemVisibility(["divSetPWCA" + (i+1)], true);
					// 2014-01-30 - Question text comes directly from the XML response now...
					// 2015-09-16 - Fix for translated question text
					setElemContent(translateQuestionText((i+1), getXMLElementData(root_qs, "question", i)), ["lblSetPWCA" + (i+1)]);
					frm.elements[DEF_FLD_LOGINANS + (i+1)].value = "";
					frm.elements[DEF_FLD_LOGINANS + (i+1)].className = g_defInputClass;
				}
				
				// Put focus in first answer field
				frm.elements[DEF_FLD_LOGINANS + "1"].focus();
		
				return msg;
			}
		}

		if (bReqOTP) {
			step.value = "4";
			if (1 != getXMLAttrNum(root_otp, "verified")) {
				setSetPWResendInfo(root, root_pwauth);
				
				setElemVisibility(["fldsSetPWOTP"], true);
				frm.elements[PG_FLDNAME_OTP].focus();
				var delivery = getXMLAttrNum(root_otp, "type");
				var conf = getXMLAttrStr(root_otp, "conf");
				var duophone = getXMLElementStr(root_otp, "duophone");	// 2018-05-29 - May be blank...
				var authyphone = getXMLElementStr(root_otp, "authyphone");	// 2018-05-29 - May be blank...
				var voicebiophrase = getXMLElementStr(root_otp, "voicebiophrase");	// 2018-11-05 - May be blank...
				var fidou2f_chal = getXMLElementStr(getXMLChildElement(root, "otp_needed"), "fidou2f_chal");	// 2018-11-29 - May be blank
				var webauthn_chal = getXMLElementStr(getXMLChildElement(root, "otp_needed"), "webauthn_chal");	// 2019-05-06 - May be blank
				setElemContent(getOTPEntryInstr(delivery, conf), ["infoSetPW"]);	// getSSEnterOTPInstr(delivery, conf)
				promptForOTP("popup_SetPW", delivery, duophone, voicebiophrase, authyphone);	// No effect for phone and email delivery types
				// 2018-11-29 - When FIDO U2F is the default OTP method
				if (PG_OTP_DELIVERY_FIDOU2F == delivery && fidou2f_chal.length > 0) {
					setTimeout(function() { displayFIDOU2FAuthPrompt(frm, fidou2f_chal, "ErrMsgSetPW"); }, 1000);
				}
				// 2019-05-13 - When WebAuthn is the default OTP method
				if (PG_OTP_DELIVERY_WEBAUTHN == delivery && webauthn_chal.length > 0) {
					setTimeout(function() { displayWebAuthnAuthPrompt(frm, webauthn_chal, "ErrMsgSetPW"); }, 1000);
				}
				// 2019-08-21 - NOTE: No need to call doWEBkey here, it's handled in promptForOTP
				return msg;
			}
		}


		// Ready to type in new password
		setElemVisibility(["fldsSetPWNewPW"], true);
		frm.elements[DEF_FLD_NEWPW].focus();
		setElemContent(getPWChangeNewPWInstr(), ["infoSetPW"]);
		step.value = "5";

		// 2011-08-29 - For pw meter
		var root_quality = getXMLChildElement(root, "pwquality");
		var root_score = getXMLChildElement(root_quality, "pw_score");
		if (root_score) {
			try {
				g_MeterMinScore = getXMLAttrNum(root_score, "rule");
				showPWMeter(true);
				
				// 2018-11-09 - See note for the declartation of Event with same date (2018-11-09) for explanation of why the line below was commenedted out.
				// Event.add(frm.elements[DEF_FLD_NEWPW], "keyup", getPWMeterFunc());
			} catch (e) {
				if (DEV_DEBUG)
					alert(formatException("displayPWChangeStep() - PWMeter exception", e));
			}
		} else {
			showPWMeter(false);
			
			// 2016-12-20 - Show the rules ahead of time?
			if (g_bPremptivePWRules) {
				msg = getPreemptivePWQualityMsg(root, root_pwauth);
				
				// NOTE: The realtime setting is only utilized when pre-emptive quality is shown
				if (g_bRealtimePWQuality) {
					initRealtimePWQuality(root, root_pwauth);
				}
			}
		}
	} catch (ex) {
		alert(formatException("displayPWChangeStep()", e));
	}
	
	return msg;
}

// Use a variable here if we need to disable this specific event at some point
var g_objRTPWQualFunc = function() { cbRealtimePWQuality(this); };

function initRealtimePWQuality(root, root_pwauth) {
	try {
		// Using a global JS object to hold the enabled quality settings so we can check locally
		if (root)
			g_objPWQuality.init(root);	
		// Our field change listener - only on the main new pw field, not the 'confirm'
		$("#NewPassword").on("input", g_objRTPWQualFunc);
		if (!bStandAlonePWChange)
			$("#SSNewPassword").on("input", g_objRTPWQualFunc);
	} catch (ex) {
		console.log(formatException("initRealtimePWQuality()", ex));
	}	
}

function cbRealtimePWQuality(fld) {
	try {
		if (g_bRecreatePWQualMsg) {
			// Build message on the fly
			var newmsg = g_objPWQuality.getMsg();
			// Using a global here!
			setElemContentDirect(newmsg, g_TargetDiv);
			g_bRecreatePWQualMsg = false;
		}
		g_objPWQuality.check(fld.value);
	} catch (ex) {
		console.log(formatException("cbRealtimePWQuality()", ex));
	}
}

/*******************************************************************************/
/* PW MANAGEMENT */
/*******************************************************************************/

function getSinglePWRuleMsg(root, min_err, ename, bGrouped, bInitialPreempt) {
	var msg = "";
	var root_rule = null;
	var localname = (ename ? ename.toLowerCase() : "(null)");
	
	if (PGAPI_RC_PW_TOO_SHORT == min_err || localname == "minlength") {
		root_rule = getXMLChildElement(root, "minlength");
		// 2019-01-17 - Only show stand-alone minlen if AD quality is not present
		if (null == getXMLChildElement(root, "adquality")) {			
			msg = getMinimumPasswordSettingMsg(getXMLAttrNum(root_rule, "rule"));
		}
	} else if (PGAPI_RC_PW_TOO_LONG == min_err || localname == "maxlength") {
		root_rule = getXMLChildElement(root, "maxlength");
		msg = getMaximumPasswordSettingMsg(getXMLAttrNum(root_rule, "rule"));
	} else if (PGAPI_RC_PW_INSUFF_LCASE == min_err || localname == "minlower") {
		root_rule = getXMLChildElement(root, "minlower");
		msg = getMinimumLowercasePasswordSettingMsg(getXMLAttrNum(root_rule, "rule"));
	} else if (PGAPI_RC_PW_INSUFF_UCASE == min_err || localname == "minupper") {
		root_rule = getXMLChildElement(root, "minupper");
		msg = getMinimumUppercasePasswordSettingMsg(getXMLAttrNum(root_rule, "rule"));
	} else if (PGAPI_RC_PW_INSUFF_NUMERIC == min_err || localname == "minnumeric") {
		root_rule = getXMLChildElement(root, "minnumeric");
		msg = getMinimumNumericPasswordSettingMsg(getXMLAttrNum(root_rule, "rule"));
	} else if (PGAPI_RC_PW_INSUFF_SPECIAL == min_err || localname == "minspecial") {
		root_rule = getXMLChildElement(root, "minspecial");
		msg = getMinimumSpecialCharsPasswordSettingMsg(getXMLAttrNum(root_rule, "rule"));
	} else if (PGAPI_RC_PW_AD_COMPLEXITY == min_err || localname == "adquality") {
		root_rule = getXMLChildElement(root, "adquality");
		var minlen_root = getXMLChildElement(root, "minlength");
		var minlen = (minlen_root ? getXMLAttrNum(minlen_root, "rule") : 8);
		var loginname = getXMLAttrStr(root_rule, "LoginName");
		var dspname = getXMLAttrStr(root_rule, "DspName");
		msg = getADPWComplexityMsg(minlen, loginname, dspname);
	} else if (PGAPI_RC_PW_INSUFF_SCORE == min_err || localname == "pw_score") {
		root_rule = getXMLChildElement(root, "pw_score");
		msg = getMinimumPWScorePasswordSettingMsg(getXMLAttrNum(root_rule, "rule"));
	} else if (localname == "pwgroup" || localname == "pwhistory" || localname == "pwdictionary" || localname == "pw_diffchars" || localname == "pwregex") {
		// Do nothing - these are all server-side checks and are handled in the main loop
	} else {
		msg = "getSinglePWRuleMsg(): Unhandled pw rule child: " + localname;
	}
	
	if (root_rule) {		
		if (bInitialPreempt || (g_bPremptivePWRules && g_bRealtimePWQuality)) {
			// 2017-01-02 - Don't show the old-style "OK" or "Failed" tails
		} else {
			switch (getXMLAttrNum(root_rule, "met")) {
				case 1:
					msg = getPWRuleMetMsg(msg);	// This will insert the text into the <li> tag!
					break;
				case -1:	// Server-side rule not checked
					break;
				default:
					msg = getPWRuleUnmetMsg(msg);
			}
		}

		if (getXMLAttrNum(root_rule, "group") == 1)
			bGrouped.value = true;
	}
	
	return msg;
}


var g_objPWQuality = {
	reset: function() {
		try {
			delete this.minLen;
			delete this.maxLen;
			delete this.minLower;
			delete this.minUpper;
			delete this.minNumeric;
			delete this.minSpecial;
			delete this.pwgroup;
			delete this.ADPWLoginName;
			delete this.ADPWDspName;
			delete this.rootXML;
		} catch (ex) {
			console.log("PWQuality::reset() exception - " + ex);
		}
	},
	
	check: function(pw) {
		try {
			if (this.minLen.enabled) {
				if (pw.length >= this.minLen.rule) {
					$("#minLenRule").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#minLenRule").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
			}
			
			if (this.maxLen.enabled) {
				if (pw.length <= this.maxLen.rule) {
					$("#maxLenRule").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#maxLenRule").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
			}
				
			if (this.minLower.enabled) {
				var count = (pw.match(/[a-z]/g) || []).length;
				if (count >= this.minLower.rule) {
					$("#minLowerRule").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#minLowerRule").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
			}
			
			if (this.minUpper.enabled) {
				var count = (pw.match(/[A-Z]/g) || []).length;
				if (count >= this.minUpper.rule) {
					$("#minUpperRule").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#minUpperRule").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
			}
			
			if (this.minNumeric.enabled) {
				var count = (pw.match(/[0-9]/g) || []).length;
				if (count >= this.minNumeric.rule) {
					$("#minNumericRule").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#minNumericRule").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
			}
			
			if (this.minSpecial.enabled) {
				var count = (pw.match(/[a-zA-Z0-9]/g) || []).length;
				count = pw.length - count;	// Any non-alphanumeric is considered a 'special'
				if (count >= this.minSpecial.rule) {
					$("#minSpecialRule").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#minSpecialRule").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
			}
			
			if (this.adComplexity.enabled) {
				// Multiple aspects to check and potentially update here!
				
				// Min len
				if (pw.length >= this.adComplexity.minlen) {
					$("#adpwminlen").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#adpwminlen").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
				// 3 of 4 character types
				var passed = 0;	// Tracking the "overall" success
				var count = (pw.match(/[a-z]/g) || []).length;
				if (count >= 1) {
					passed++;
					$("#adpwlower").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#adpwlower").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
				count = (pw.match(/[A-Z]/g) || []).length;
				if (count >= 1) {
					passed++;
					$("#adpwupper").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#adpwupper").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
				count = (pw.match(/[0-9]/g) || []).length;
				if (count >= 1) {
					passed++;
					$("#adpwnumeric").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#adpwnumeric").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
				count = (pw.match(/[a-zA-Z0-9]/g) || []).length;
				count = pw.length - count;	// Any non-alphanumeric is considered a 'special'
				if (count >= 1) {
					passed++;
					$("#adpwspecial").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#adpwspecial").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
				
				// Now changing the format of the "3 out of 4" rule heading as well
				//	Not using the images because they appear at the end of the embedded list!
				if (passed >= 3) {
					$("#adpwcats").removeClass("pwrulebad").addClass("pwruleok");
				} else {
					$("#adpwcats").removeClass("pwruleok").addClass("pwrulebad");
				}
				
				// Portion of usernames in pw
				if (!this.containsPortion(this.adComplexity.loginname, pw) && !this.containsPortion(this.adComplexity.dspname, pw)) {
					$("#adpwnouser").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				} else {
					$("#adpwnouser").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				}
			}
			
			// 2020-03-20 - Illegal IIS chars shown inline?
			if (g_bInlineIISIllegalCharsPWRule) {
				// This func takes an array of fields!
				var fld = document.createElement("input");
				fld.name = "password";
				fld.value = pw;
				if (doesPWContainIllegalChars([fld])) {
					$("#iisRule").removeClass("pwruleok pwruleok-img").addClass("pwrulebad pwrulebad-img");
				} else {
					$("#iisRule").removeClass("pwrulebad pwrulebad-img").addClass("pwruleok pwruleok-img");
				}
			}
			
			//this.pwgroup;
		} catch (ex) {
			console.log("PWQuality::check() exception - " + ex);
		}
	},
	
	getMsg: function() {
		try {
			var msg = "", msg2 = "";
			var msg_hdr = getPWComplexityHdr(this.pwgroup.rule);
			var msg_mid = getPWComplexityMid(this.pwgroup.rule);
			var msg_ftr = getPWComplexityServerSide(this.rootXML) + getPWComplexityFtr(this.pwgroup.rule);

			// Minimum length
			if (this.minLen.enabled) {
				var tmp = getMinimumPasswordSettingMsg(this.minLen.rule);
				if (this.minLen.grouped)
					msg2 = msg2 + tmp;
				else
					msg = msg + tmp;
			}
			
			// Maximum length
			if (this.maxLen.enabled) {
				var tmp = getMaximumPasswordSettingMsg(this.maxLen.rule);
				if (this.maxLen.grouped)
					msg2 = msg2 + tmp;
				else
					msg = msg + tmp;
			}
		
			// Minimum lowercase
			if (this.minLower.enabled) {
				var tmp = getMinimumLowercasePasswordSettingMsg(this.minLower.rule);
				if (this.minLower.grouped)
					msg2 = msg2 + tmp;
				else
					msg = msg + tmp;
			}
			
			// Minimum uppercase
			if (this.minUpper.enabled) {
				var tmp = getMinimumUppercasePasswordSettingMsg(this.minUpper.rule);
				if (this.minUpper.grouped)
					msg2 = msg2 + tmp;
				else
					msg = msg + tmp;
			}
			
			// Minimum numeric
			if (this.minNumeric.enabled) {
				var tmp = getMinimumNumericPasswordSettingMsg(this.minNumeric.rule);
				if (this.minNumeric.grouped)
					msg2 = msg2 + tmp;
				else
					msg = msg + tmp;
			}
			
			// Minimum special
			if (this.minSpecial.enabled) {
				var tmp = getMinimumSpecialCharsPasswordSettingMsg(this.minSpecial.rule);
				if (this.minSpecial.grouped)
					msg2 = msg2 + tmp;
				else
					msg = msg + tmp;
			}
			
			// AD complexity
			if (this.adComplexity.enabled) {
				msg = msg + getADPWComplexityMsg(this.adComplexity.minlen, this.adComplexity.loginname, this.adComplexity.dspname);
			}
			
			// IIS illegal chars
			if (g_bInlineIISIllegalCharsPWRule) {
				msg = msg + getIISIllegalCharsMsg();
			}
			
			if (msg_hdr.length > 0 || msg_ftr.length > 0)
				msg = msg_hdr + msg + msg_mid + msg2 + msg_ftr;
		} catch (ex) {
			console.log("PWQuality::getMsg() exception - " + ex);
		}
		
		return msg;
	},
	
	init: function(root) {
		try {
			this.reset();

			// What we expect for XML
			/*
			<pwquality>
				<minlength rule="a" met="{0|1}" group="{0|1}"/>
				<maxlength rule="b" met="{0|1}" group="{0|1}"/>
				<minlower rule="c" met="{0|1}" group="{0|1}"/>
				<minupper rule="d" met="{0|1}" group="{0|1}"/>
				<minnumeric rule="e" met="{0|1}" group="{0|1}"/>
				<minspecial rule="f" met="{0|1}" group="{0|1}"/>
				<adquality minlen="g" loginname="SAMACCOUNTNAME" dspname="DSPNAME"/>
				<pwgroup rule="{min_matches}"/>
			</pwquality>
			*/
			
			this.rootXML = root;	// 2019-02-18 - Need to save this for showing server-side rules
			var root_qual = getXMLChildElement(root, "pwquality");
			if (root_qual) {
				// Grouping?
				var rule = getXMLChildElement(root_qual, "pwgroup")
				this.pwgroup = {};
				this.pwgroup.enabled = (null === rule ? false : true);
				if (this.pwgroup.enabled) {
					this.pwgroup.rule = getXMLAttrNum(rule, "rule");
				}

				// Minimum length
				rule = getXMLChildElement(root_qual, "minlength");
				this.minLen = {};
				this.minLen.enabled = (typeof rule == "undefined" ? false : true);
				if (this.minLen.enabled) {
					this.minLen.rule = getXMLAttrNum(rule, "rule");
					this.minLen.grouped = (1 == getXMLAttrNum(rule, "group") ? true : false);
				}
				
				// Maximum length
				rule = getXMLChildElement(root_qual, "maxlength");
				this.maxLen = {};
				this.maxLen.enabled = (typeof rule == "undefined" ? false : true);
				if (this.maxLen.enabled) {
					this.maxLen.rule = getXMLAttrNum(rule, "rule");
					this.maxLen.grouped = (1 == getXMLAttrNum(rule, "group") ? true : false);
				}
			
				// Minimum lowercase
				rule = getXMLChildElement(root_qual, "minlower");
				this.minLower = {};
				this.minLower.enabled = (typeof rule == "undefined" ? false : true);
				if (this.minLower.enabled) {
					this.minLower.rule = getXMLAttrNum(rule, "rule");
					this.minLower.grouped = (1 == getXMLAttrNum(rule, "group") ? true : false);
				}
				
				// Minimum uppercase
				rule = getXMLChildElement(root_qual, "minupper");
				this.minUpper = {};
				this.minUpper.enabled = (typeof rule == "undefined" ? false : true);
				if (this.minUpper.enabled) {
					this.minUpper.rule = getXMLAttrNum(rule, "rule");
					this.minUpper.grouped = (1 == getXMLAttrNum(rule, "group") ? true : false);
				}
				
				// Minimum numeric
				rule = getXMLChildElement(root_qual, "minnumeric");
				this.minNumeric = {};
				this.minNumeric.enabled = (typeof rule == "undefined" ? false : true);
				if (this.minNumeric.enabled) {
					this.minNumeric.rule = getXMLAttrNum(rule, "rule");
					this.minNumeric.grouped = (1 == getXMLAttrNum(rule, "group") ? true : false);
				}
				
				// Minimum special
				rule = getXMLChildElement(root_qual, "minspecial");
				this.minSpecial = {};
				this.minSpecial.enabled = (typeof rule == "undefined" ? false : true);
				if (this.minSpecial.enabled) {
					this.minSpecial.rule = getXMLAttrNum(rule, "rule");
					this.minSpecial.grouped = (1 == getXMLAttrNum(rule, "group") ? true : false);
				}
				
				// AD complexity
				rule = getXMLChildElement(root_qual, "adquality");
				this.adComplexity = {};
				this.adComplexity.enabled = (typeof rule == "undefined" ? false : true);
				if (this.adComplexity.enabled) {
					this.minLen.enabled = false;	// Disable the stand-alone min length rule
					this.adComplexity.minlen = getXMLAttrNum(rule, "minlen");
					this.adComplexity.loginname = getXMLAttrStr(rule, "loginname");
					this.adComplexity.dspname = getXMLAttrStr(rule, "dspname");
				}				
			}
		} catch (ex) {
			console.log("PWQuality::init() exception - " + ex);
		}
	},

	containsPortion: function(name, pw) {
		try {
			var lcPW = pw.toLowerCase();
			var tokens = name.split(/[,._ #-]/);	// 2019-01-17 - Hyphen needs to be last so it doesn't indicate a 'range'
			for (var i = 0; i < tokens.length; i++) {
				if (tokens[i].length >= 3) {
					var thetok = tokens[i].toLowerCase();
					//console.log("Checking for '" + thetok + "' in new password");
					if (-1 != lcPW.indexOf(thetok)) {
						//console.log("New password contained part of user's name: " + thetok);
						return true;
					}
				}
			}			
			return false;
		} catch (ex) {
			console.log("PWQuality::containsPortion() exception - " + ex);
		}
	}
}


//2019-09-03 - Changed function name, and now also checks for &# sequence
function doesPWContainIllegalChars(arrFields) {
	var re = /[&][#]/;//regex to check for &# pattern
	for (var i = 0; i < arrFields.length; i++) {
		if (arrFields[i].name.length > 0 && arrFields[i].value.length > 0){//make sure field exists
			if (arrFields[i].value.includes("<") || re.test(arrFields[i].value)) {// check
				arrFields[i].focus();
				return true;
			}
		}
	}
	return false;
}

function doesPWStartWithLTSign(arrFields) {
	for (var i = 0; i < arrFields.length; i++) {
		if (arrFields[i].name.length > 0 && arrFields[i].value.length > 0 && "<" == arrFields[i].value.charAt(0)) {
			arrFields[i].focus();
			return true;
		}
	}
	return false;
}


/*******************************************************************************/
/* CHALLENGE RECOVERY */
/*******************************************************************************/

function resetChallengeObject() {
	this.arrMandQ = [];
	this.nMandQs = 0;
	this.arrOptQ = [];
	this.ResetFieldMap = [];
	for (var i = 1; i <= MAX_OPT_QS; i++)
		this.ResetFieldMap[i] = 0;	
	this.nOptQs = 0;
	this.nOptShares = 0;
	this.nOptThreshold = 0;
	this.curScreen = 0;
	this.bSetCQA = true;
	this.theForm = null;
	this.strInstMand = "PLACEHOLDER - Mandatory answer instructions";
	this.strInstOptSet = "PLACEHOLDER - Set optional answer instructions";
	this.strInstOptUse = "PLACEHOLDER - Use optional answer instructions";
}
	
function ChallengeObject() {
	this.resetObj = resetChallengeObject;
	this.arrMandQ = [];
	this.nMandQs = 0;
	this.arrOptQ = [];
	this.ResetFieldMap = [];
	for (var i = 1; i <= MAX_OPT_QS; i++)
		this.ResetFieldMap[i] = 0;
	this.nOptQs = 0;
	this.nOptShares = 0;
	this.nOptThreshold = 0;
	this.curScreen = 0;
	this.bSetCQA = true;
	this.theForm = null;
	this.strInstMand = "PLACEHOLDER - Mandatory question instructions";
	this.strInstOptSet = "PLACEHOLDER - Set optional answer instructions";
	this.strInstOptUse = "PLACEHOLDER - Use optional answer instructions";
}	


function CalcRemainingAnswers() {
	var MandAns = 0, OptAns = 0;
	for (i = 1; i <= g_objCQA.nMandQs; i++) {
		if (document.getElementById("MandAns" + i).value.length >= ANSWER_MIN_LEN)
			MandAns++;
	}
	for (i = 1; i <= g_objCQA.nOptQs; i++) {
		if (document.getElementById("OptAns" + i).value.length >= ANSWER_MIN_LEN)
			OptAns++;
	}

	setElemVisibility(["spanAnsRemain", "spanContinueBtn"], false);
	if (MandAns == g_objCQA.nMandQs && OptAns >= ((g_objCQA.bSetCQA) ? g_objCQA.nOptShares : g_objCQA.nOptThreshold)) {
		// Show "submit" button
		setElemVisibility(["spanContinueBtn"], true);
	} else {
		// Update running count span
		setElemVisibility(["spanAnsRemain"], true);	// 2013-08-13 - IE9 wasn't refreshing for AcctMgmt so make div visible before updating text
		setElemContent(getRemainingAnsCount(g_objCQA.nMandQs, MandAns, (g_objCQA.bSetCQA) ? g_objCQA.nOptShares : g_objCQA.nOptThreshold, OptAns), ["spanAnsRemainText"]);
	}
}


function AdvSetAns(increment) {
	try {
		setElemVisibility(["fldsChal_MandQs", "fldsChal_OptQs1", "fldsChal_OptQs2", "fldsChal_OptQs3"], false);
		var eFocus;

		if (increment == 0) {	// Initial display
			if (g_objCQA.nMandQs > 0)
				g_objCQA.curScreen = 0;
			else
				g_objCQA.curScreen = 1;
		} else {
			g_objCQA.curScreen = g_objCQA.curScreen + increment;
		}
		
		setElemVisibility(["SetChalPrev", "SetChalNext"], true);	// Show both buttons by default
		setElemVisibility(["SetChalPrevDis", "SetChalNextDis"], false);	// Hide both DISABLED buttons by default
		
		switch (g_objCQA.curScreen) {
			case 0:	// Mandatory questions
				setElemVisibility(["SetChalPrev"], false);	// No prev button here!
				setElemVisibility(["SetChalPrevDis"], true);
				setElemVisibility(["fldsChal_MandQs"], true);
				setElemContent(g_objCQA.strInstMand, ["infoSS"]);
				eFocus = g_objCQA.theForm.MandAns1;
	
				if (g_objCQA.nOptQs == 0) { 	// Are there any optional ?s
					setElemVisibility(["SetChalNext"], false);
					setElemVisibility(["SetChalNextDis"], true);
				}
				break;

			case 1:	// Optional question screens
			case 2:
			case 3:
				setElemVisibility(["fldsChal_OptQs" + g_objCQA.curScreen], true);
				setElemContent((g_objCQA.bSetCQA) ? g_objCQA.strInstOptSet : g_objCQA.strInstOptUse, ["infoSS"]);
				var optlim = g_objCQA.nOptQs;
				if (bDDQuestions)
					optlim = (g_objCQA.bSetCQA ? g_objCQA.nOptShares : g_objCQA.nOptThreshold);
				if (g_objCQA.curScreen*QS_PER_SCREEN >= optlim) {
					setElemVisibility(["SetChalNext"], false);
					setElemVisibility(["SetChalNextDis"], true);
				}					
					
				if (g_objCQA.curScreen == 1) {
					if (bDDQuestions)
						eFocus = g_objCQA.theForm.OQ1;
					else
						eFocus = g_objCQA.theForm.OptAns1;
					if (g_objCQA.nMandQs == 0) {
						setElemVisibility(["SetChalPrev"], false);
						setElemVisibility(["SetChalPrevDis"], true);
					}
				} else if (g_objCQA.curScreen == 2) {
					if (bDDQuestions)
						eFocus = g_objCQA.theForm.OQ6;
					else
						eFocus = g_objCQA.theForm.OptAns6;
				} else if (g_objCQA.curScreen == 3) {
					if (bDDQuestions)
						eFocus = g_objCQA.theForm.OQ11;
					else
						eFocus = g_objCQA.theForm.OptAns11;
				}				
				break;
				
			default:
				alert("Challenge screen " + g_objCQA.curScreen + " is out of range");
		}
		
		eFocus.focus();
		
		CalcRemainingAnswers();
	} catch (e) {
		alert(formatException("AdvSetAns(" + increment + ")", e));
	}
}


function areQuestionChoicesValid() {
	// 2015-12-17 - This new condition is to ensure the user is on the challenge answer screen
	if (bDDQuestions && "" == document.getElementById("SSChalEntry").style.display) {
		var optlim = (g_objCQA.bSetCQA ? g_objCQA.nOptShares : g_objCQA.nOptThreshold)
		for (var q = 1; q <= optlim; q++) {
			try {
				var sel = document.getElementById("OQ" + q);
				if (0 == sel.selectedIndex) {
					alert(getDDQuestionsNoChoiceMsg());
					sel.focus();
					return;
				} else {
					// Ensure no question is selected multiple times
					for (var r = 1; r <= optlim; r++) {
						if (r != q) {
							var dupe = document.getElementById("OQ" + r);
							if (sel.selectedIndex == dupe.selectedIndex) {
								alert(getDDQuestionsDupeChoiceMsg(q, r));
								dupe.focus();
								return false;
							}
						}
					}				
				}			
			} catch (e) {
				alert("Error validating question selects");
				return false;
			}
		}
	}
	return true;
}


function getIdxFromQText(qtext, def) {
	// Recovery only sends back questions that the user enrolled, we need to parse this number off the front of the question text
	var pos = qtext.indexOf(")");
	if (pos == -1) {
		alert("Question text did not contain the index!\n   " + qtext);
		return "" + def;
	}
	return qtext.substr(0, pos);
}


function ShowChallengeQuestions(root, frm, bEnroll) {
	try {
		setElemVisibility(["btnsSSChalPrevNext", "SSChalEntry"], true);
		
		if (null == g_objCQA)
			g_objCQA = new ChallengeObject();
		else
			g_objCQA.resetObj();
		var root_mqs = getXMLChildElement(root, "mand_questions");
		g_objCQA.nMandQs = getXMLAttrNum(root_mqs, "count");
		var root_oqs = getXMLChildElement(root, "opt_questions");
		var root_ans = getXMLChildElement(root, "opt_answered");
		if (root_ans) {
			g_objCQA.nOptQs = g_objCQA.nOptShares = getXMLAttrNum(root_ans, "count");
		} else {
			g_objCQA.nOptQs = getXMLAttrNum(root_oqs, "count");
			g_objCQA.nOptShares = getXMLAttrNum(root_oqs, "shares");
		}	
		g_objCQA.nOptThreshold = getXMLAttrNum(root_oqs, "threshold");

		var minlen = getXMLElementNum(root, "answer_minlen");
		if (minlen > 0)
			ANSWER_MIN_LEN = minlen;			

		g_objCQA.strInstMand = getMandCQAInstructions(g_objCQA.nMandQs);
		g_objCQA.strInstOptSet = getSetCQAOptInstructions(g_objCQA.nOptQs, g_objCQA.nOptShares);
		g_objCQA.strInstOptUse = getUseCQAOptInstructions(g_objCQA.nOptShares, g_objCQA.nOptThreshold);

		// These questions common to both challenge types
		for (var i = 0; i < g_objCQA.nMandQs; i++) {
			// Not using a zero-based array here because the question field names start with "1"
			g_objCQA.arrMandQ[i+1] = (i+1) + ") " + getXMLElementStr(root_mqs, "question", i);
		}

		//setElemVisibility(["spanSetChalBtn", "spanResetPwBtn"], false);
		setElemVisibility(["spanContinueBtn"], false);
		if (bEnroll) {
			g_objCQA.bSetCQA = true;
			for (var i = 0; i < g_objCQA.nOptQs; i++)
				g_objCQA.arrOptQ[i+1] = translateQuestionText((i+1), getXMLElementStr(root_oqs, "question", i));
		} else {
			g_objCQA.bSetCQA = false;
			for (var i = 0; i < g_objCQA.nOptQs; i++) {
				var idx = parseInt(getXMLElementStr(root_ans, "answered", i), 10);
				g_objCQA.arrOptQ[i+1] = translateQuestionText(idx, getXMLElementStr(root_oqs, "question", idx-1));
				g_objCQA.ResetFieldMap[idx] = i + 1;
			}
		}

		g_objCQA.theForm = frm;
		showChallengeQuestionArea(frm);
	} catch (e) {
		alert(formatException("ShowChallengeQuestions()", e));
	}
}


function showChallengeQuestionArea(frm) {
	var	optlim = MAX_OPT_QS;	// Default: no drop-downs
	
	if (g_objCQA.nMandQs > MAX_MAND_QS)
		g_objCQA.nMandQs = MAX_MAND_QS;
	if (g_objCQA.nOptQs > MAX_OPT_QS)
		g_objCQA.nOptQs = MAX_OPT_QS;
	
	// Common to both modes
	//setElemVisibility(["fldChalPW", "btnsChal_Creds"], false);
	//setElemVisibility(["btnsChal_Answers"], true);
	//frm.elements[DEF_FLD_USERNAME].disabled = true;
	
	for (i = 1; i <= MAX_MAND_QS; i++) {
		setElemVisibility(["divChalMandQ" + i], true);
		setElemVisibility(["divChalMandQ" + i], true, true);
	}
	
	// Only show the slots for the number of required shares for enrollment, threshold for recovery
	if (bDDQuestions)
		optlim = (g_objCQA.bSetCQA ? g_objCQA.nOptShares : g_objCQA.nOptThreshold);	
	for (i = 1; i <= optlim; i++) {
		setElemVisibility(["divChalOptQ" + i], true);
		setElemVisibility(["divChalOptQ" + i], true, true);
	}
	
	// 2015-12-17 - Collapse any undisplayed question divs - on 1st screen only!
	if (optlim <= 5) {
		for (/*i initialized from prior for() loop*/; i <=5; i++) {
			setElemVisibility(["divChalOptQ" + i], false, false);
			setElemVisibility(["divChalOptQ" + i], false);
		}
		// Completely hide the prev/next buttons
		// 2016-10-14 - Only hide if mand questions are not present
		if (0 == g_objCQA.nMandQs) {
			setElemVisibility(["btnsSSChalPrevNext"], false);
		}
	} else {
		// Show the prev/next buttons
		setElemVisibility(["btnsSSChalPrevNext"], true);
	}
	
	// Mandatory questions don't support DD mode
	for (i = 1; i <= g_objCQA.nMandQs; i++)
		setElemContent(g_objCQA.arrMandQ[i], ["lblMandQ" + i]);
	// 2016-10-14 - Collapse unneeded mandatory slots
	for (/*i initialized from prior for() loop*/; i <=5; i++) {
		setElemVisibility(["divChalMandQ" + i], false, false);
		setElemVisibility(["divChalMandQ" + i], false);
	}
		
	if (bDDQuestions) {
		// Create drop-downs for required number of optional questions
		for (i = 1; i <= optlim; i++) {
			//setElemContent("", ["lblOptQ" + i]);
			setElemVisibility(["lblOptQ" + i], false);	// 2017-02-17
			var sel = document.getElementById("OQ" + i);
			try {
				sel.style.display = "";
				sel.options.length = 0;	// Clear any existing options
				sel.options[sel.options.length] = new Option(getCQTopOptionText(), 0);
				for (j = 1; j <= g_objCQA.nOptQs; j++)
					sel.options[sel.options.length] = new Option(g_objCQA.arrOptQ[j], getIdxFromQText(g_objCQA.arrOptQ[j], j));
			} catch (e) {
				alert(formatException("ShowChallengeQuestionArea() - Error populating question " + i + " drop-down", e));
			}
		}
	} else {		
		for (i = 1; i <= g_objCQA.nOptQs; i++) {
			setElemContent(g_objCQA.arrOptQ[i], ["lblOptQ" + i]);
			setElemVisibility(["lblOptQ" + i], true);	// 2017-02-17
			try {	// 2011-10-26 - So this JS is compatible with the PG Offline Desktop
				// Hide all drop-downs
				document.getElementById("OQ" + i).style.display = "none";
			} catch (ex) {}
		}
	}
	
	// Hide any unused divs, e.g. only 3 questions are to be answered, hide #4 & #5
	var thefloor = (g_objCQA.nMandQs < g_objCQA.nOptQs) ? g_objCQA.nOptQs : g_objCQA.nMandQs;
	if (thefloor >= QS_PER_SCREEN)
		thefloor = MAX_OPT_QS;
	for (i = g_objCQA.nMandQs + 1; i <= MAX_MAND_QS; i++)
		setElemVisibility(["divChalMandQ" + i], false, (i <= thefloor) ? true : false);
	if (!bDDQuestions)
		optlim = g_objCQA.nOptQs;
	for (i = optlim + 1; i <= MAX_OPT_QS; i++)
		setElemVisibility(["divChalOptQ" + i], false, (i <= thefloor) ? true : false);

	AdvSetAns(0);	// Handles showing the proper screen, enabling/disabling buttons
}



/*******************************************************************************/
/* NEW SELF-SERVICE */
/*******************************************************************************/

function clearSSFields() {
	var frm = document.getElementById("SSForm");
	
	// 2012-06-12 - Pass along OTP if necessary, limit this to sidecar for now, can be removed later.
	if (g_bSideCar) {
		try {
			if (frm.elements[PG_FLDNAME_OTP].value.length > 0) {
				document.forms[PG_FORM_OTPENTRY].elements[PG_FLDNAME_OTP].value = frm.elements[PG_FLDNAME_OTP].value;
			}
		} catch(e) {}
	}
	
	var fields = [PG_FLDNAME_OTP];
	for (var i = 1; i <= MAX_MAND_QS; i++)
		fields.push("MandAns" + i);
	for (var i = 1; i <= MAX_OPT_QS; i++) {
		fields.push(DEF_FLD_OPTANS_BASE + i);
	}
	fields.push(PG_FLDNAME_PHONE);
	fields.push(PG_FLDNAME_EMAIL);
	// 2015-01-27 - Tried *not* clearing SSAction to fix IE10 bug that sent blank SSAction if attempting SSPR use before getting prompted to enroll after login
	//	This broke sequential enrollments during login (CA, then phone)
	fields.push(PG_FLDNAME_SSACTION);
	fields.push(PG_FLDNAME_SSSTEP);
	fields.push(PG_FLDNAME_SSAUTH);	// May not exist?
		
	for (var i = 0; i < fields.length; i++) {
		if (frm.elements[fields[i]]) {
			if (frm.elements[fields[i]].type == "radio" || frm.elements[fields[i]].type == "checkbox") {
				frm.elements[fields[i]].checked = false;
			} else if (frm.elements[fields[i]].type == "text"  || frm.elements[fields[i]].type == "password" || frm.elements[fields[i]].type == "hidden" || frm.elements[fields[i]].type == "tel") {
				frm.elements[fields[i]].value = "";
			} else {
				//alert("Unexpected field: '" + fields[i] + "', type: " + frm.elements[fields[i]].type);
			}
		}
	}
}


function resetSSDialog() {
	setElemVisibility(["SSSuppressReminders", "SSChooseAction", "SSChooseAuth", "SSActionChosen", "SSStaticPWEntry", "SSPhoneOTPEnrollment", "SSEmailOTPEnrollment", "SSOTPEntry", 
			"SSChalEntry", "btnsSSChalPrevNext", "spanSkipBtn", "spanAnsRemain", "spanBtnContinueDis", "SS_NewPW"], false);
	setElemVisibility(["SSUsername", "btnSS", "spanContinueBtn", "spanCancelBtn"], true);
	setElemVisibility(["spanLogin2FAOptIn"], false);
	setElemContent(getSSTitle(), ["SSTitle"]);
}


function hideSSReason() {
	var helpdiv = document.getElementById("divSSReason");
	if (helpdiv)
		helpdiv.style.display = "none";
}


function showSSReason(thelink, inner) {
	var helpdiv = document.getElementById("divSSReason");
	if (!helpdiv) {
		helpdiv = document.createElement('div');
		helpdiv.id = "divSSReason";
		helpdiv.className = "SStooltip";
		helpdiv.onmouseover = function() { document.body.style.cursor = "pointer"; }
		helpdiv.onmouseout = function() { document.body.style.cursor = "default"; }
		helpdiv.onclick = function() { this.style.display = "none"; }
		document.body.appendChild(helpdiv);	// since this is absolutely positioned, make it a child of the top-level page
	}
	setElemContentDirect(inner, helpdiv);
	//helpdiv.display = inner;
	helpdiv.style.display = "inline";
	// 2016-03-16 - Regression fix
	var rect = thelink.getBoundingClientRect();
	helpdiv.style.left = rect.left + "px";
	helpdiv.style.top = rect.top + "px";
}


function setSSResendInfo(root) {
	var root_otp = getXMLChildElement(root, "otp_needed");
	if (null != root_otp) {
		var delivery = getXMLElementNum(root_otp, "delivery");
		var conf = getXMLElementStr(root_otp, "conf");
		// Populate the hidden div with the resend HTML
		setElemContent(getOTPMethodsHTML(root_otp, "SSForm", "submitSS()", "popup_SS"), ["popup_OTPResend"]);

		var theurl = "<a href='javascript:displayOTPResendPopup()'>" + getResendOTPLinkText(delivery) + "</a>";
		setElemContent(theurl, ["spnResendSS"]);
	}
}


function displaySSAuthEntry(frm, root, root_ss, ssaction) {
	// Reset the auth options
	frm.elements[DEF_FLD_USERNAME].disabled = true;
	if (SS_ACTION_UNLOCKACCOUNT == ssaction || SS_ACTION_RESETPW == ssaction || SS_ACTION_RECOVERPW == ssaction) {
		// Setup some initial display stuff
		setElemVisibility(["SSActionChosen"], g_DisplaySSActionChosen);

		// Get auth type - check for challenges first
		var child = getXMLChildElement(root, "challenge");
		if (null == child) {
			child = getXMLChildElement(root_ss, "otp_needed");
			var delivery = getXMLElementNum(child, "delivery");
			var conf = getXMLElementStr(child, "conf");
			var duophone = getXMLElementStr(child, "duophone");	// 2018-05-29 - May be blank...
			var voicebiophrase = getXMLElementStr(root_ss, "voicebiophrase");	// 2018-11-05 - May be blank...
			var fidou2f_chal = getXMLElementStr(root_ss, "fidou2f_chal");	// 2018-11-29 - May be blank
			var webauthn_chal = getXMLElementStr(root_ss, "webauthn_chal");	// 2018-11-29 - May be blank
			var authyphone = getXMLElementStr(root_ss, "authyphone");
			
			// 2014-03-03 - Fix for PK OTP validation
			// 2018-05-24 - Fix for DuoPush as default OTP type
			if ((0 == delivery || PG_OTP_DUOPUSH == delivery || PG_OTP_DELIVERY_BKM_PALM == delivery || PG_OTP_DELIVERY_AUTHY == delivery) && "3" == frm.elements[PG_FLDNAME_SSSTEP].value) {
				frm.elements[PG_FLDNAME_SSSTEP].value = "4";
				return;
			}
			
			setElemVisibility(["SSOTPEntry"], true);
			frm.elements[PG_FLDNAME_OTP].focus();
			
			// 2013-01-31 - Need to still set instructions for phone & email delivery - promptForOTP does not handle these
			if (PG_OTP_DELIVERY_SMS == delivery || PG_OTP_DELIVERY_VOICE == delivery)
				setElemContent(getSSProveAuthInstr(SS_AUTH_PHONEOTP, conf, 0), ["infoSS"]);
			else if (PG_OTP_DELIVERY_EMAIL == delivery)
				setElemContent(getSSProveAuthInstr(SS_AUTH_EMAILOTP, conf, 0), ["infoSS"]);
			
			promptForOTP("popup_SS", delivery, duophone, voicebiophrase, authyphone);	// No effect for phone and email delivery types
			setSSResendInfo(root_ss);
			
			// 2018-11-29 - When FIDO U2F is the default OTP method
			if (PG_OTP_DELIVERY_FIDOU2F == delivery && fidou2f_chal.length > 0) {
				setTimeout(function() { displayFIDOU2FAuthPrompt(frm, fidou2f_chal, "ErrMsgSS"); }, 1000);
			}
			// 2019-05-12 - When WebAuthn is the default OTP method
			if (PG_OTP_DELIVERY_WEBAUTHN == delivery && webauthn_chal.length > 0) {
				setTimeout(function() { displayWebAuthnAuthPrompt(frm, webauthn_chal, "ErrMsgSS"); }, 1000);
			}
            // 2019-08-21 - NOTE: No need to call doWEBkey here, it's handled in promptForOTP
		} else {
			// Show challenge questions - instructions are automatically set in this function
			ShowChallengeQuestions(root, frm, false);
		}
	} else {
		// An enrollment action
		if (SS_ACTION_ENROLL_CHAL == ssaction || SS_ACTION_ENROLL_MAND_CHAL == ssaction) {
			ShowChallengeQuestions(root, frm, true);
		} else if (SS_ACTION_ENROLL_PHONE == ssaction || SS_ACTION_ENROLL_EMAIL == ssaction) {
			setElemContent(getSSEnterOTPInstr(ssaction), ["infoSS"]);
			// 2021-09-23 - OTP field was hidden during mobile phone enrollment, so we added 'fldSSOTP' to the array.
			setElemVisibility(["SSOTPEntry", "fldSSOTP"], true);
			frm.elements[PG_FLDNAME_OTP].focus();
			setSSResendInfo(root);
		}
	}
}


function displaySSStep(root, root_ss) {
	var msg = "";	// Let the main loop handle updating the error div
	try {
		resetSSDialog();
		
		var frm = document.getElementById("SSForm");
		var step = frm.elements[PG_FLDNAME_SSSTEP];
		
		// 2013-01-31 - New case to support TTT which can effectively skip the auth display step
		if ("3" == step.value) {
			var state = getXMLAttrNum(root_ss, "state");
			if (SS_STATE_COMPLETE == state)
				step.value = "4";
		}
		
		if ("0" == step.value) {
			// 2012-01-09 - Special case for PGD, user/pw are correct so do a login
			submitFromSS();
		} else if ("1" == step.value) {
			var arrEnrolled = [];
			var actionsAvailable = 0;	
			
			// First get enrollment actions so we can check enrollment status
			var idx = 0;
			var bCheckedOne = false;
			var child = getXMLChildElement(root_ss, "actauth", idx);
			var inner = ""
			while (child) {
				// 2012-11-06 - Checking each element for any country list
				populateCountries(getXMLChildElement(child, "countries"));
				
				var attr = getXMLAttrStr(child, "type");
				var theid = PG_FLDNAME_SSACTION + attr;
				var dsp = getSSDisplayValue(parseInt(attr, 10));
				var bEnrolled = (1 == getXMLAttrNum(child, "enrolled") ? true : false);
				var bEnrollDisabled = (1 == getXMLAttrNum(child, "enrollmentdisabled") ? true : false);
				inner += "<input type='radio' name='" + PG_FLDNAME_SSACTION + "' id='" + theid + "' value='" + attr + "'";
				if (bEnrollDisabled)
					inner += " disabled><span class='lblRadioDisabled'>";
				else
					inner += "><label for='" + theid + "' class='lblRadio'>";
				if (bEnrolled) {
					arrEnrolled.push(attr);
					var conf = getXMLElementStr(child, "conf");
					inner += dsp + "<span class='ssenrolldetail'> (Enrolled" + (conf.length > 0 ? " as " + conf : "") + ")</span></label><br>";
				} else {
					inner += dsp + "<span class='ssunenrolled'> (Unenrolled)</span></label><br>";
				}
				child = getXMLChildElement(root_ss, "actauth", ++idx);
			}

			// Now the SS actions...
			idx = 0;
			child = getXMLChildElement(root_ss, "action", idx);
			inner = "";
			while (child) {
				var attr = getXMLAttrStr(child, "type");
				var theid = PG_FLDNAME_SSACTION + attr;
				var dsp = getSSDisplayValue(parseInt(attr, 10));
				var bLocked = (1 == getXMLAttrNum(child, "locked") ? true : false);
				var requires = getXMLAttrNum(child, "requires");
				
				if (parseInt(attr, 10) == SS_ACTION_UNLOCKACCOUNT)
					bLocked = false;	// Allow unlock action even if acct is locked
					
				// Check all children auths to see if the required ones are enrolled
				var strReason = "";
				var bAvailable = false;
				var bValidEnroll = false, bMultiple = (requires > 0 ? true : false);
				var numATEnabled = 0;
		
				// Build the bit mask for auth types enabled for this action
				for (var i = 0, at = getXMLAttrStr(getXMLChildElement(child, "auth"), "type", i); at; i++, at = getXMLAttrStr(getXMLChildElement(child, "auth", i), "type")) {
					numATEnabled = numATEnabled | parseInt(at, 10);
				}
				
				for (var i = 0; i < arrEnrolled.length; i++) {
					if (0 == requires) {	// If any single auth is required, then a single applicable enrolled AT saves the day
						if (arrEnrolled[i] == (numATEnabled & arrEnrolled[i])) {
							bValidEnroll = true;
							break;
						}
					} else {
						if (arrEnrolled[i] == (requires & arrEnrolled[i])) {	// Need parens here and below to preserve order of operations
							if (requires > 0)
								requires -= arrEnrolled[i];
						}
					}
				}

				if ( (bValidEnroll || bMultiple) && 0 == requires && !bLocked) {
					bAvailable = true;
				} else {
					if (bLocked) {
						strReason = getSSUnavailMsgLocked(parseInt(attr, 10));
					} else {
						//var arrAllATs = [SS_ACTION_ENROLL_CHAL, SS_ACTION_ENROLL_PHONE, SS_ACTION_ENROLL_EMAIL];
						var arrAllATs = [SS_AUTH_CHALANS, SS_AUTH_MAND_CHALANS, SS_AUTH_GENOTP];
						for (var i = 0; i < arrAllATs.length; i++) {
							var cond1 = (requires > 0 && (arrAllATs[i] == (requires & arrAllATs[i])));		// For multiple auths required w/ 1 or more missing
							var cond2 = (requires == 0 && (arrAllATs[i] == (numATEnabled & arrAllATs[i])));	// For "any" single auths which are not enrolled
							if (cond1 || cond2) {
								strReason += getSSUnavailMsgAuthUnenrolled(arrAllATs[i]);
							}
						}
					}
				}				
				
				inner += "<input type='radio' name='" + PG_FLDNAME_SSACTION + "' id='" + theid + "' value='" + attr + "'";
				if (bAvailable) {
					actionsAvailable++;
					if (!bCheckedOne) {
						bCheckedOne = true;
						inner += " checked";
					}
					inner += "><label for='" + theid + "' class='lblRadio'>" + dsp + "</label><br>";
				} else {
					inner += " disabled><label class='lblRadioDisabled'>" + dsp + "</label>" + getSSUnavailMsgHeader() + strReason + getSSUnavailMsgFooter() + "<br>";
				}
					
				child = getXMLChildElement(root_ss, "action", ++idx);
			}
			if (inner.length > 0)
				setElemContent(inner, ["SSRecoveryActions"]);

			setElemVisibility(["SSChooseAction"], true);
			frm.elements[DEF_FLD_USERNAME].disabled = true;
			setElemContent(getSSActionsInstr(), ["infoSS"]);
			
			// 2012-08-31 (SSPM-7) - Ensure at least 1 radio button is already checked!
			if (!bCheckedOne) {
				for (var k = 0; k < frm.elements.length; k++) {
					if (frm.elements[k].type == "radio" && frm.elements[k].id.indexOf(PG_FLDNAME_SSACTION) >= 0 && !frm.elements[k].disabled) {
						frm.elements[k].checked = true;
						break;
					}
				}
			}
			
			// 2015-08-04 - Disable Continue button
			if (0 == actionsAvailable) {
				try {
					setElemVisibility(["spanContinueBtn"], false);
					setElemVisibility(["spanBtnContinueDis"], true);
					setAuthType(PG_AUTHTYPE_NOENTERKEYSUBMIT);
					var btnCancel = document.getElementById("btnSSCancel");
					if (btnCancel) {
						btnCancel.onclick = function() {
							if (DEBUG) alert("Overridden Cancel button");
							if (g_bPGClient) {
								if (DEBUG) alert("PGClient detected - closing browser window");
								closePGClient();
							} else if (g_bSideCar) {
								try {
									parent.closeIframe(true);
								} catch (e) {
									alert(formatException("submitLoginFromPopup() - parent.closeIframe()", e));
								}
							} else {
								// Work around known IE bug that leads to "Bad Request Type"
								var bAddUser = false;
								var redir = location.pathname;
								if (location.search.length > 0) {
									redir += location.search;
									if (location.hash.length > 0)
										redir += "#" + location.hash;
									if (-1 == location.search.indexOf(PG_AUTO_FULLUSERNAME)) {
										bAddUser = true;
									}
								} else {
									redir += "?r=1"
									bAddUser = true;
								}
								
								if (bAddUser) {
									redir += PG_AUTO_FULLUSERNAME + frm.elements[DEF_FLD_USERNAME].value;
								}								
								window.location = redir;
							}
						};
					}
				} catch (e) {}
			}
			
			step.value = "2";	// Update to the next step in the process
			
			// 2016-10-19 - Fixed focus on Continue button styling issue occurring in IE, Edge, and Firefox
			try {
				document.getElementById("SSAction1").focus();
			} catch (ex) {}
   
			// 2013-06-04 - Auto-advance the Actions Available dialog if only a single option is available
			if (1 == actionsAvailable && g_AutoAdvanceSSActionChoice) {
				submitSS();
			}
		} else if ("2" == step.value) {
			// Get the requested action value
			var ssaction = getXMLAttrNum(getXMLChildElement(root_ss, "action"), "type");
			var bAutoSubmit = false;

			// Reset the auth options
			setElemContent("", ["SSEnrollmentAuth"]);
			frm.elements[DEF_FLD_USERNAME].disabled = true;
			if (SS_ACTION_UNLOCKACCOUNT == ssaction || SS_ACTION_RESETPW == ssaction || SS_ACTION_RECOVERPW == ssaction) {
				// Show the chosen SS action
				setElemContent(getSSDisplayValue(parseInt(ssaction, 10)), ["SSActionChosen_Desc"]);
				setElemVisibility(["SSActionChosen"], g_DisplaySSActionChosen);
				setElemVisibility(["SSChooseAuth"], true);
				setElemContent(getSSAuthTypeInstr(), ["infoSS"]);
				
				// Display the authentication options for the chosen action, (2012-01-03) Unless multiple auths are required!
				var idx = 0, opts = 0;
				var child = getXMLChildElement(root_ss, "auth", idx);
				var inner = "";
				var requires = getXMLAttrNum(getXMLChildElement(root_ss, "action"), "requires");
				if (requires > 0)
					bAutoSubmit = true;
				while (child) {
					var attr = getXMLAttrStr(child, "type");
					// 2013-01-31 - Only display generic OTP option now
					if (parseInt(SS_AUTH_CHALANS, 10) == attr || parseInt(SS_AUTH_GENOTP, 10) == attr) {
						var theid = PG_FLDNAME_SSAUTH + attr;
						var dsp = getSSDisplayValue(parseInt(attr, 10), getXMLAttrNum(child, "thresh"));
						inner += "<input type='radio' name='" + PG_FLDNAME_SSAUTH + "' id='" + theid + "' value='" + attr + "'" + (inner.length == 0 ? " checked" : "") + "><label for='" + theid + "' class='lblRadio'>" + dsp + "</label><br>";
						opts++;
					}
					child = getXMLChildElement(root_ss, "auth", ++idx);
				}
				if (inner.length > 0)
					setElemContent(inner, ["SSEnrollmentAuth"]);
					
				// 2012-01-03 - If only a single auth type, then continue automatically
				if (1 == opts)
					bAutoSubmit = true;
			} else if (SS_ACTION_ENROLL_CHAL == ssaction || SS_ACTION_ENROLL_MAND_CHAL == ssaction || SS_ACTION_ENROLL_PHONE == ssaction || SS_ACTION_ENROLL_EMAIL == ssaction) {
				setElemVisibility(["SSStaticPWEntry"], true);
				frm.elements[DEF_FLD_PASSWORD].focus();
				
				if (SS_ACTION_ENROLL_CHAL == ssaction || SS_ACTION_ENROLL_MAND_CHAL == ssaction) {
					// They must provide the right password, then we'll retrieve the questions
					setElemContent(getSSEnrollInstr(SS_ACTION_ENROLL_CHAL), ["infoSS"]);
					if (frm.elements[DEF_FLD_PASSWORD].value.length > 0)
						bAutoSubmit = true;
				} else if (SS_ACTION_ENROLL_PHONE == ssaction) {
					setElemContent(getSSEnrollInstr(SS_ACTION_ENROLL_PHONE), ["infoSS"]);
					setElemVisibility(["SSPhoneOTPEnrollment"], true);
					if (frm.elements[DEF_FLD_PASSWORD].value.length > 0)
						frm.elements[PG_FLDNAME_PHONE].focus();
					if (frm.elements[PG_FLDNAME_PHONE].value.length > 0)
						bAutoSubmit = true;
				} else if (SS_ACTION_ENROLL_EMAIL == ssaction) {
					setElemContent(getSSEnrollInstr(SS_ACTION_ENROLL_PHONE), ["infoSS"]);
					setElemVisibility(["SSEmailOTPEnrollment"], true);
					if (frm.elements[DEF_FLD_PASSWORD].value.length > 0)
						frm.elements[PG_FLDNAME_EMAIL].focus();
					if (frm.elements[PG_FLDNAME_EMAIL].value.length > 0)
						bAutoSubmit = true;
				}
			} else {
				alert("Unknown self-service action type: " + ssaction);
			}
			
			step.value = "3";
			if (bAutoSubmit)
				submitSS();
		} else if ("3" == step.value) {
			// Need to display the right entry fields based on the requested auth type (and potential "next" auth)
			// <ss><actauth type='12' enrolled='1'><conf>xxx-xxx-2469</conf></actauth></ss>
			var ssaction = getXMLAttrNum(getXMLChildElement(root_ss, "action"), "type");
			displaySSAuthEntry(frm, root, root_ss, ssaction);
			// 2014-03-03 - Fix for PK OTP validation
			if ("4" == step.value) {
				displaySSStep(root, root_ss);	// Recurse
			} else {
				step.value = "4";	// Update to the next step in the process
			}
		} else if ("4" == step.value) {
			var ssaction = getXMLAttrNum(getXMLChildElement(root_ss, "action"), "type");
			
			// Do we need to display a different entry screen for multiple auths?
			var newprompt = getXMLAttrNum(getXMLChildElement(root_ss, "action"), "newprompt");
			// 2018-05-24 - ... or Duo as default?
			var autopush = false;
			var root_delivery = getXMLChildElement(root_ss, "otp_needed");
			if (root_delivery) {
				var delivery = getXMLElementNum(root_delivery, "delivery");
				if (PG_OTP_DUOPUSH == delivery || PG_OTP_DELIVERY_BKM_PALM == delivery || PG_OTP_DELIVERY_AUTHY == delivery)
					autopush = true;
			}			
			if (1 == newprompt || autopush) {
				displaySSAuthEntry(frm, root, root_ss, ssaction);
				return msg;	// Should be blank!
			}				
			
			// Setup some initial display stuff
			frm.elements[DEF_FLD_USERNAME].disabled = true;
			frm.elements[DEF_FLD_NEWPW].value = frm.elements[DEF_FLD_CONFPW].value = "";
			
			if (SS_ACTION_RESETPW == ssaction) {
				setElemVisibility(["SSActionChosen"], g_DisplaySSActionChosen);
				setElemVisibility(["SS_NewPW"], true);
				setElemContent(getSSEnterNewPWInstr(), ["infoSS"]);
				msg = getIdentityVerifiedMsg();
				
				frm.elements[DEF_FLD_NEWPW].focus();
				step.value = "5";
				
				// 2011-08-29 - For pw meter
				var root_quality = getXMLChildElement(root, "pwquality");
				var root_score = getXMLChildElement(root_quality, "pw_score");
				if (root_score) {
					try {
						g_MeterMinScore = getXMLAttrNum(root_score, "rule");
						showPWMeter(true);
						// 2018-11-09 - See note for the declartation of Event with same date (2018-11-09) for explanation of why the line below was commenedted out.
						// Event.add(frm.elements[DEF_FLD_NEWPW], "keyup", getPWMeterFunc());
					} catch (e) {
						if (DEV_DEBUG)
							alert(formatException("displaySSStep() - PWMeter exception", e));
					}
				} else {
					showPWMeter(false);
					
					// 2016-12-20 - Show the rules ahead of time?
					if (g_bPremptivePWRules) {
						var root_pwqual = getXMLChildElement(root, "pwquality");
						msg = getPreemptivePWQualityMsg(root, root_pwqual);
						if (g_bRealtimePWQuality) {
							initRealtimePWQuality(root, root_pwqual);
						}
					}
				}
			} else {
				var state = getXMLAttrNum(root_ss, "state");
				if (SS_STATE_COMPLETE == state) {
					// 2017-01-10 - Prevent extraneous 2FA prompts
					if ("1" == getXMLElementStr(root, "optin2fa")) {
						frmMainLogon.elements[PG_FLDNAME_OTP].value = frm.elements[PG_FLDNAME_OTP].value;
					}
					setElemContent("", ["infoSS"]);
					setElemVisibility(["btnSS", "SSUsername"], false);
					var bSubmit = (SS_ACTION_ENROLL_CHAL == ssaction || SS_ACTION_ENROLL_MAND_CHAL == ssaction || SS_ACTION_ENROLL_PHONE == ssaction || SS_ACTION_ENROLL_EMAIL == ssaction);
					var thepw = getXMLElementStr(root, "recovered_password");
					msg = getSuccessfulSelfServiceMsg(root, bSubmit, thepw);
					clearSSFields();
					// 2018-05-24 - Duo Push done during the same browser session was always unhiding the SS dialog OTP fields
					setElemVisibility(["SSOTPEntry"], false);
					// 2012-07-25 - Prevent enter key submit
					setAuthType(PG_AUTHTYPE_NOENTERKEYSUBMIT);
				}
			}
		} else if ("5" == step.value) {
			var state = getXMLAttrNum(root_ss, "state");
			if (SS_STATE_COMPLETE == state) {
				setElemContent("", ["infoSS"]);
				setElemVisibility(["btnSS", "SSUsername"], false);
				setMainFields(frm, DEF_FLD_USERNAME, DEF_FLD_NEWPW);	// 2013-06-19 - Now pushing username field back into main form for sidecar
				msg = getSuccessfulSelfServiceMsg(root, g_bSubmitFromSSPWReset);
				clearSSFields();
				// 2018-05-24 - Duo Push done during the same browser session was always unhiding the SS dialog OTP fields
				setElemVisibility(["SSOTPEntry"], false);
				// 2012-07-25 - Prevent enter key submit
				setAuthType(PG_AUTHTYPE_NOENTERKEYSUBMIT);
			}
		} else {
			alert("Unhandled Self-service step: " + step);
		}
	} catch (e) {
		alert(formatException("displaySSStep()", e));
	}
	
	return msg;
}


function skipEnrollmentCookie(ssaction) {
	// Create cookie to allow the enrollment to be skipped (both opt and req)
	// For PGDesktop, create a non-session cookie for 3 minutes
	// For browsers, create a non-session cookie with a longer expiration (5 mins), otherwise they could keep the same browser up for days and not use any skips
	
	var cookiename = COOKIE_SKIPENROLL_CHAL;
	if (SS_ACTION_ENROLL_PHONE == ssaction) {
		cookiename = COOKIE_SKIPENROLL_PHONE;
	} else if (SS_ACTION_ENROLL_EMAIL == ssaction) {
		cookiename = COOKIE_SKIPENROLL_EMAIL;
	}
	
	var expires = new Date();
	var data = expires.toString();
	var expmins = (g_bPGClient ? 3 : 5);
	expires.setMinutes(expires.getMinutes() + expmins);
	setCookie(cookiename, data, expires, "/");
}


function skipMobileAppEnrollmentCookie() {
	// Create cookie to allow the enrollment to be skipped (both opt and req)
	// For PGDesktop, create a non-session cookie for 3 minutes
	// For browsers, create a non-session cookie with a longer expiration (5 mins), otherwise they could keep the same browser up for days and not use any skips
	var expires = new Date();
	var data = expires.toString();
	var expmins = (g_bPGClient ? 3 : 5);
	expires.setMinutes(expires.getMinutes() + expmins);
	setCookie(COOKIE_SKIPENROLL_MOBILEAPP, data, expires, "/");
}


function closeSS(bSkip) {
	hideSSReason();
	var frmDest = document.getElementById("SSForm");
	
	resetSSDialog();
	clearSSFields();
	frmDest.elements["SSStep"].value = "1";
	// 2012-01-09 - Ternary operator to prevent browser from automatically closing for PG Client
	closePopup('popup_SS', false, (g_bNoPGDBrowserClose ? false : g_bSideCar), PG_AUTHTYPE_LOGIN);
	
	// Try to auto-submit the login form for them
	if (bSkip) {
		skipEnrollmentCookie(g_ssAction);
		// The main logon form is the one that's actually submitted to the server
		if (document.getElementById("chkDisableRemindersSS").checked)
			frmMainDisplay.elements["DisableEnrollmentReminders"].value = "1";
		else
			frmMainDisplay.elements["DisableEnrollmentReminders"].value = "0";
		submitLogin();
	}
}


function submitFromSS() {
	resetSSDialog();
	document.getElementById("SSForm").elements["SSStep"].value = "1";
	// 2012-01-09 - Ternary operator to prevent browser from automatically closing for PG Client
	closePopup('popup_SS', false, (g_bNoPGDBrowserClose ? false : g_bSideCar), PG_AUTHTYPE_LOGIN);
	submitLogin();
}

var g_bFromSSGroup = false;
var g_SavedSSRoot = null;
var g_SSGroupEnrolledChal = g_SSGroupEnrolledPhone = g_SSGroupEnrolledEmail = 0;	// 0=not grouped, 1=grouped but not enrolled, 2=grouped and enrolled

function shouldDisplaySSGroupChooser(root_group, root) {
	// Bail if the element isn't present
	if (null == root_group)
		return false;
	
	// 2018-08-12 - If CQA is present but NOT grouped, then let that display first (keeps original ordering intact
	var ss_root = getXMLChildElement(root, "ss");
	for (var i = 0; i < ss_root.childNodes.length; i++) {
		if (SS_ACTION_ENROLL_CHAL == getXMLAttrNum(ss_root.childNodes[i], "type")) {
			for (var j = 0; j < root_group.childNodes.length; j++) {
				if ("chal" == root_group.childNodes[j].nodeName)
					return true;
			}
			return false;
		}
	}			

	return true;
}	
	
function createSSGroupChooser(root_group) {
	setElemContent(getSSEnrollmentTitle(0), ["SSTitle"]);	// Passing 0 uses the default text return value 
	var numreq = getXMLAttrNum(root_group, "req");
	var nSkips = getXMLAttrNum(root_group, "skipsleft");
	var bSkipAllowed = (nSkips > 0 ? true : false);
	var total = root_group.childNodes.length;
	var enrolled = 0;	// How many they've already completed
	
	// Parse out the types that aren't yet enrolled
	var inner = "";
	for (var i = 0; i < root_group.childNodes.length; i++) {
		var child = root_group.childNodes[i];
		var bCompleted = ("0" == child.textContent ? false : true);
		if (bCompleted) enrolled++;
		var theclass = (bCompleted ? "lblRadioDisabled" : "lblRadio");
		if ("chal" == child.nodeName) {
			inner += "<input type='radio' id='radioSSGrpChal' name='" + PG_FLDNAME_SSGROUPCHOICE + "' value='chal'" + (bCompleted ? " disabled" : "") + ">";
			inner += "<label class='" + theclass + "' for='radioSSGrpChal'>" + getSSGroupCQADesc() + (bCompleted ? getSSGroupCompleted() : "") + "</label><br>";
			g_SSGroupEnrolledChal = (bCompleted ? 2 : 1);
		} else if ("phone" == child.nodeName) {
			inner += "<input type='radio' id='radioSSGrpPhone' name='" + PG_FLDNAME_SSGROUPCHOICE + "' value='phone'" + (bCompleted ? " disabled" : "") + ">";
			inner += "<label class='" + theclass + "' for='radioSSGrpPhone'>" + getSSGroupPhoneDesc() + (bCompleted ? getSSGroupCompleted() : "") + "</label><br>";
			g_SSGroupEnrolledPhone = (bCompleted ? 2 : 1);
		} else if ("email" == child.nodeName) {
			inner += "<input type='radio' id='radioSSGrpEmail' name='" + PG_FLDNAME_SSGROUPCHOICE + "' value='email'" + (bCompleted ? " disabled" : "") + ">";
			inner += "<label class='" + theclass + "' for='radioSSGrpEmail'>" + getSSGroupEmailDesc() + (bCompleted ? getSSGroupCompleted() : "") + "</label><br>";
			g_SSGroupEnrolledEmail = (bCompleted ? 2 : 1);
		} else {
			console.log("createSSGroupChooser(): Unexpected grouped enrollment type: " + child.nodeName);
		}
	}
	
	setElemContent(getSSGroupEnrollInstr(numreq, total, enrolled, nSkips), ["infoSS"]);

	setElemVisibility(["btnSS"], false);
	setElemVisibility(["SSUsername", "SSGroupChooser"], true);
	
	setElemVisibility(["spanGroupSSCancelBtn"], !bSkipAllowed);
	setElemVisibility(["spanGroupSSSkipBtn"], bSkipAllowed);
	
	// 2021-05-07 - For some misconfigurations, the flow jumps to the OTP Entry screen to complete phone or email enrollment
	//	Re-hide these in case the user submitted for an OTP, then cancelled
	setElemVisibility(["SSPhoneOTPEnrollment", "SSEmailOTPEnrollment"], false);
	
	if (inner.length > 0) {
		setElemContent(inner, ["divSSGroupTypes"]);
		var rbtns = document.getElementsByName(PG_FLDNAME_SSGROUPCHOICE);
		for (var i = 0; i < rbtns.length; i++) {
			if (!rbtns[i].disabled) {
				rbtns[i].checked = true;
				rbtns[i].focus();
				break;
			}
		}
	}
}


function submitSSGroup() {
	isGrouped = true;
	try {
		// What value did they choose?
		var sel = document.querySelector("input[name='" + PG_FLDNAME_SSGROUPCHOICE + "']:checked").value;
		// Chal = 0x10 (16), Phone = 0x20 (32), Email = 0x40 (64)
		var theval = ("email" == sel ? SS_AUTH_EMAILOTP : ("phone" == sel ? SS_AUTH_PHONEOTP : SS_AUTH_CHALANS));		
		
		setElemVisibility(["SSGroupChooser"], false);
		
		// Manipulate the copied root from earlier to 'force' the proper enrollment
		var new_root = g_SavedSSRoot;
		// Need to remove the grouping element so we fall through to original code
		new_root.removeChild(getXMLChildElement(new_root, "grpenroll"));
		
		var ss_root = getXMLChildElement(new_root, "ss");
		for (var i = 0; i < ss_root.childNodes.length;) {
			var actauth_root = ss_root.childNodes[i];
			var acttype = getXMLAttrNum(actauth_root, "type");
			if (acttype != theval) {
				ss_root.removeChild(actauth_root);
			} else {
				// Replace the <required> child element to ensure no skips allowed from the subsequent dialog
				// There may be other child elements so you can't just overwrite innerHTML
				for (var i = 0; i < actauth_root.childNodes.length; i++) {
					var child = actauth_root.childNodes[i];
					if ("required" == child.nodeName) {
						// 2018-08-12 - Need to modify the attribute values directly, couldn't use innerText
						for (var j = 0; j < child.attributes.length; j++) {
							var attr = child.attributes[j];
							if ("skipsleft" == attr.name || "skipsmax" == attr.name) {
								attr.value = "0";
							}
						}
						break;
					}
				}
				
				// 2018-08-12 - Need this to auto-submit the challenge answer dialog
				if (SS_AUTH_CHALANS == theval)
					g_bFromSSGroup = true;

				i++;
			}
		}
		
		// Wipe out the global XML object
		g_SavedSSRoot = null;
		
		// Make the same call with the modfified XML
		showSSEnrollPopup(new_root);
	} catch (e) {
		console.log(formatException("submitSSGroup()", e));
	}
}


function closeSSGroup(bSkip) {
	g_SavedSSRoot = null;
	setElemVisibility(["SSGroupChooser"], false);
	
	if (bSkip) {
		// 2018-08-13 - Create and add this field dynamically rather than clutter login.aspx. Hint to the back-end that the skip occurred.
		var ff = document.createElement("input");
		ff.type = "hidden";
		ff.name = "SSGroupSkipped";
		ff.value = "1";
		frmMainLogon.appendChild(ff);
		
		// 2018-08-13 - These flags are all set in createSSGroupChooser(). If skip is enabled, we need to create cookies for ALL grouped types that are unenrolled
		if (1 == g_SSGroupEnrolledChal) skipEnrollmentCookie(SS_ACTION_ENROLL_CHAL);
		if (1 == g_SSGroupEnrolledPhone) skipEnrollmentCookie(SS_ACTION_ENROLL_PHONE);
		if (1 == g_SSGroupEnrolledEmail) skipEnrollmentCookie(SS_ACTION_ENROLL_EMAIL);
		
		closeSS(true);
	} else {
		// Just close the dialog, no HTTP activity
		closeSS(false);
	}
}

					
function showSSEnrollPopup(root) {
	closeAllPopups();
	clearMainFormErrors();	
	var frmDest = document.getElementById("SSForm");
	try {
		doPopup("popup_SS");
		
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		try {
			// 2012-08-02 - This persists a successfully enrolled phone OTP in the "enter emailed OTP" field - why are we doing this otherwise: from parent to popup form?
			//frmDest.elements[PG_FLDNAME_OTP].value = document.forms[PG_FORM_OTPENTRY].elements[PG_FLDNAME_OTP].value;
		} catch (e) {}
		
		// Initialization stuff
		setElemContent("", ["ErrMsgSS"]);
		frmDest.elements[DEF_FLD_USERNAME].className = frmDest.elements[DEF_FLD_PASSWORD].className = frmDest.elements[DEF_FLD_NEWPW].className = frmDest.elements[DEF_FLD_CONFPW].className = g_defInputClass;
		frmDest.elements[DEF_FLD_NEWPW].value = frmDest.elements[DEF_FLD_CONFPW].value = "";
		for (i = 1; i <= MAX_MAND_QS; i++)
			frmDest.elements["MandAns" + i].value = "";
		for (i = 1; i <= MAX_OPT_QS; i++)
			frmDest.elements["OptAns" + i].value = "";
		document.getElementById("chkDisableRemindersSS").checked = false;	// So it doesn't persist across multiple enrollments
		
		setElemContent("", ["SSRecoveryActions"]);
		setElemContent("", ["SSEnrollmentAuth"]);
		
		if (root) {
			setAuthType(PG_AUTHTYPE_SS);
	
			// 2018-08-12 - Do we need to show the new grouped chooser?
			var root_group = getXMLChildElement(root, "grpenroll");
			if (shouldDisplaySSGroupChooser(root_group, root)) {
				g_SavedSSRoot = root;
				createSSGroupChooser(root_group);
			} else {
				if ("1" == getXMLElementStr(root, "optin2fa")) {
					setElemVisibility(["spanLogin2FAOptIn"], true);
				}
				
				// 2012-01-31 - Don't copy an OTP into the static pw field (happens when OTP required but user must still enroll)
				//	Doing this here because closeAllPopups resets the authtype
				// 2013-10-19 - Moved after auth type changes, otherwise static pw wasn't populated for CQ/A enrollment after 2FA login
				var bPopulatePW = (PG_AUTHTYPE_OTPENTRY == AUTHTYPE ? false : true);
			
				// Determine which enrollment to prompt about
				/* <ss state="2">
				 *	<actauth type='10' enrolled='0'><optional suppress='0' /></actauth>
				 *	<actauth type='11' enrolled='0'><optional suppress='1' /></actauth>
				 *	<actauth type='12' enrolled='0'><required skipsleft='3' skipsmax='3' /></actauth>
				 * </ss>
				 */
				var root_ss = getXMLChildElement(root, "ss");
				var root_act = getXMLChildElement(root_ss, "actauth");
				try {
					var ssaction = getXMLAttrNum(root_act, "type");
					// 2012-10-24 - For stale ERB after recovery - the "ss" element is not present!
					if (0 == ssaction)
						ssaction = SS_ACTION_ENROLL_CHAL;
					g_ssAction = ssaction;
					
					// 2012-10-29 - If SSAction field doesn't exist, then create it based on the action (if any) we've received
					if (null == frmDest.elements[PG_FLDNAME_SSACTION] || undefined === frmDest.elements[PG_FLDNAME_SSACTION].value) {
						var ff = document.createElement("INPUT");
						ff.type = "hidden";
						ff.name = PG_FLDNAME_SSACTION;
						frmDest.appendChild(ff);
						// 2012-11-15 - Fix/hack for PGD - .NET WebBrowser control runs as IE7 by default!
						try {
							if (typeof frmDest.elements[PG_FLDNAME_SSACTION] == "undefined") {
								eval("frmDest.elements." + PG_FLDNAME_SSACTION + " = ff");
							}
						} catch (e) {
							alert(formatException("showSSEnrollPopup - IE7 fix()", e));
						}
					}
					
					// 2012-11-06 - We're now clearing this value when cancelling the dialog so be sure to set a new value
					try {
						if (frmDest.elements[PG_FLDNAME_SSACTION].value == "" || undefined === frmDest.elements[PG_FLDNAME_SSACTION].value)
							frmDest.elements[PG_FLDNAME_SSACTION].value = ssaction;
					} catch (e) {
						alert(formatException("showSSEnrollPopup - value detection", e));
					}
					
					
					// 2012-11-06 - Checking each element for any country list
					populateCountries(getXMLChildElement(root_act, "countries"));
					if (hasXMLAttr(root_act, "needprovider"))
						g_bNeedPhoneProvider = (1 == getXMLAttrNum(root_act, "needprovider") ? true : false);
					setElemVisibility(["divPhoneProvSS"], g_bNeedPhoneProvider);
				
					var bRequired = false, bSuppress = false, nSkips = 0;
					var test = getXMLChildElement(root_act, "optional");
					if (test) {
						bSuppress = (getXMLAttrNum(test, "suppress") == 1 ? true : false);
					} else {
						test = getXMLChildElement(root_act, "required");
						bRequired = true;
						nSkips = getXMLAttrNum(test, "skipsleft");
					}
					setElemContent(getSSEnrollmentTitle(ssaction), ["SSTitle"]);
					setElemContent(getSSEnrollInstr(ssaction, bRequired, bSuppress, nSkips), ["infoSS"]);
				
					setElemVisibility(["btnSS", "SSUsername", "SSStaticPWEntry", "spanSkipBtn"], true);	// Common to all enrollment types
					// CRP - Make Cancel Visible
					if(isGrouped){
						setElemVisibility(["spanCancelBtn"], true);
					} else {
						setElemVisibility(["spanCancelBtn"], false);
					}
					frmDest.elements["SSStep"].value = "3";
					if (bPopulatePW)
						frmDest.elements[DEF_FLD_PASSWORD].value = frmMainDisplay.elements[FLD_DSP_PASS].value;
					if (frmDest.elements[DEF_FLD_USERNAME].value.length > 0) {
						frmDest.elements[DEF_FLD_PASSWORD].focus();
					} else {
						frmDest.elements[DEF_FLD_USERNAME].disabled = false;
						frmDest.elements[DEF_FLD_USERNAME].focus();
					}
					
					// Hide the skip button altogether?
					if (bRequired && 0 == nSkips)
						setElemVisibility(["spanSkipBtn"], false);
					
					// Display the proper additional fields
					if (bSuppress)
						setElemVisibility(["SSSuppressReminders"], true);
					if (SS_ACTION_ENROLL_PHONE == ssaction) {
						setElemVisibility(["SSPhoneOTPEnrollment"], true);
						if (frmDest.elements[DEF_FLD_PASSWORD].value.length > 0)
							frmDest.elements[PG_FLDNAME_PHONE].focus();
					} else if (SS_ACTION_ENROLL_EMAIL == ssaction) {
						setElemVisibility(["SSEmailOTPEnrollment"], true);
						if (frmDest.elements[DEF_FLD_PASSWORD].value.length > 0)
							frmDest.elements[PG_FLDNAME_EMAIL].focus();
					} else {
						// 2013-03-04 - Only auto-submit for QA enrollment				
						// 2012-05-01 - Auto-submit form if user/pw are present AND PG Desktop AND no skips
						if (frmDest.elements[DEF_FLD_USERNAME].value.length > 0 && frmDest.elements[DEF_FLD_PASSWORD].value.length > 0
							&& (g_bPGClient || g_bFromSSGroup) && (bRequired && 0 == nSkips) ) {
							if (DEBUG) alert("Auto-submitting SS form");
							g_bFromSSGroup = false;
							submitSS();
						}
					}
				} catch (e) {
					alert(formatException("showSSEnrollPopup()", e));
				}
			}	// 2018-08-12 - Grouped chooser
		} else {
			// 2012-01-09 - Force a login to start the self-service enrollment steps
			setAuthType(PG_AUTHTYPE_SS);
			frmDest.elements["SSStep"].value = "0";	// Forces the login
			
			setElemContent(getSSEnrollmentTitle(0), ["SSTitle"]);
			setElemContent(getSSEnrollInstr(0, true, false, 0), ["infoSS"]);

			setElemVisibility(["btnSS", "SSUsername", "SSStaticPWEntry"], true);
			setElemVisibility(["spanCancelBtn"], false);
			
			if (frmDest.elements[DEF_FLD_USERNAME].value.length > 0) {
				frmDest.elements[DEF_FLD_PASSWORD].focus();
			} else {
				frmDest.elements[DEF_FLD_USERNAME].disabled = false;
				frmDest.elements[DEF_FLD_USERNAME].focus();
			}			
		}
		
		// Auto-submit the form if required input(s) are present
		/*if (bSet) {
			if (frmDest.elements[DEF_FLD_USERNAME].value.length > 0 && frmDest.elements[DEF_FLD_PASSWORD].value.length > 0) {
				//alert("Stopping auto-submit!");
				//submitSS();
			}
		} else {
			if (frmDest.elements[DEF_FLD_USERNAME].value.length > 0) {
				//submitSS();
			}
		}*/
	} catch(e) {
		alert(formatException("showSSEnrollPopup()", e));
	}
}



/*******************************************************************************/
/* MULTIPLE USER REPOSITORIES */
/*******************************************************************************/
// This function should only be used for auto-pops - it prompts the user to enter their primary name/pw (has no repository info)
function showAcctLinkEnrollPopup() {
	closeAllPopups();
	clearMainFormErrors();	
	var frmDest = document.getElementById("AcctLinkForm");
	try {
		doPopup("popup_AcctLink");

		// Show the user/pw entry fields, hide the 'display' one
		setElemVisibility(["AcctLinkUsernameDisplay", "AcctLinkSystemEntry"], false);
		setElemVisibility(["AcctLinkUsernameEntry", "AcctLinkStaticPWEntry"], true);
		
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		try {
			frmDest.elements[PG_FLDNAME_OTP].value = document.forms[PG_FORM_OTPENTRY].elements[PG_FLDNAME_OTP].value;
		} catch (e) {}
		
		// Initialization stuff
		setElemContent("", ["ErrMsgAcctLink"]);
		frmDest.elements[PG_FLDNAME_LINKUSER].className = frmDest.elements[PG_FLDNAME_LINKPASS].className = g_defInputClass;
		frmDest.elements[PG_FLDNAME_LINKUSER].value = frmDest.elements[PG_FLDNAME_LINKPASS].value = "";
		document.getElementById("chkDisableRemindersAcctLink").checked = false;	// So it doesn't persist across multiple enrollments
		
		setAuthType(PG_AUTHTYPE_ACCTLINK);
		frmDest.elements[PG_FLDNAME_ACCTLINKSTEP].value = "0";
		setElemContent(getAcctLinkEnrollInstr(), ["infoAcctLink"]);
		
		if (frmDest.elements[DEF_FLD_USERNAME].value.length > 0) {
			frmDest.elements[DEF_FLD_PASSWORD].focus();
		} else {
			frmDest.elements[DEF_FLD_USERNAME].focus();
		}
	} catch(e) {
		alert(formatException("showAcctLinkEnrollPopup()", e));
	}
}


function showAcctLinkPopup(root) {
	closeAllPopups();
	clearMainFormErrors();	
	var frmDest = document.getElementById("AcctLinkForm");
	try {
		resetAcctLinkDialog();
		doPopup("popup_AcctLink");
		
		// Hide the user/pw entry fields, show the 'display' one
		setElemVisibility(["AcctLinkUsernameDisplay", "AcctLinkSystemEntry"], true);
		setElemVisibility(["AcctLinkUsernameEntry", "AcctLinkStaticPWEntry"], false);
			
		// Both of these fields are hidden
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		frmDest.elements[DEF_FLD_PASSWORD].value = frmMainDisplay.elements[FLD_DSP_PASS].value;
		
		// Initialization stuff
		setElemContent("", ["ErrMsgAcctLink"]);
		frmDest.elements[PG_FLDNAME_LINKUSER].className = frmDest.elements[PG_FLDNAME_LINKPASS].className = g_defInputClass;
		frmDest.elements[PG_FLDNAME_LINKUSER].value = frmDest.elements[PG_FLDNAME_LINKPASS].value = "";
		document.getElementById("chkDisableRemindersAcctLink").checked = false;	// So it doesn't persist across multiple enrollments
			
		frmDest.elements[PG_FLDNAME_ACCTLINKSTEP].value = "";	// Clear so we know we're handling the linked account
		setAuthType(PG_AUTHTYPE_ACCTLINK);
		setElemContent(getAcctLinkInitialInstr(), ["infoAcctLink"]);
		
		try {
			var root_al = getXMLChildElement(root, "acctlink");
			var root_sys = getXMLChildElement(root_al, "system");
			var guid = getXMLAttrStr(root_sys, "guid");
			frmDest.elements[PG_FLDNAME_LINKGUID].value = guid;
			
			// Putting main username in a span instead of an editable field that we must maintain
			setElemContent(frmDest.elements[DEF_FLD_USERNAME].value, ["AcctLink_MainUser"]);
			setElemContent(getXMLElementStr(root_sys, "name"), ["AcctLink_DisplayName"]);
		} catch (e) {
			alert("Failed to read XML for account linkage");
		}
		
		frmDest.elements[PG_FLDNAME_LINKUSER].focus();
	} catch(e) {
		alert(formatException("showAcctLinkPopup()", e));
	}
}


function closeAcctLink(bSkip) {
	var frmDest = document.getElementById("AcctLinkForm");
	
	resetAcctLinkDialog();
	clearAcctLinkFields();
	// 2012-01-09 - Ternary operator to prevent browser from automatically closing for PG Client
	closePopup('popup_AcctLink', false, (g_bNoPGDBrowserClose ? false : g_bSideCar), PG_AUTHTYPE_LOGIN);
	
	// Try to auto-submit the login form for them
	//if (bSkip) {
	if (false) {
		skipEnrollmentCookie(g_ssAction);
		// The main logon form is the one that's actually submitted to the server
		if (document.getElementById("chkDisableRemindersAcctLink").checked)
			frmMainDisplay.elements["DisableEnrollmentReminders"].value = "1";
		else
			frmMainDisplay.elements["DisableEnrollmentReminders"].value = "0";
		submitLogin();
	}
}


function resetAcctLinkDialog() {
	setElemVisibility(["fldsAcctLink"], true);
	
	setElemContent("", ["AcctLink_MainUser"]);
	setElemContent("", ["AcctLink_DisplayName"]);
}


function clearAcctLinkFields() {
	var frm = document.getElementById("AcctLinkForm");
	var fields = [PG_FLDNAME_LINKUSER];
	fields.push(PG_FLDNAME_LINKPASS);
	fields.push(PG_FLDNAME_LINKGUID);
			
	for (var i = 0; i < fields.length; i++)
		frm.elements[fields[i]].value = "";	
}


function submitFromAcctLink() {
	//resetSSDialog();
	// 2012-01-09 - Ternary operator to prevent browser from automatically closing for PG Client
	closePopup('popup_AcctLink', false, (g_bNoPGDBrowserClose ? false : g_bSideCar), PG_AUTHTYPE_LOGIN);
	submitLogin();
}



/*******************************************************************************/
/* RISK-BASED AUTH */
/*******************************************************************************/

/* Example:
<scoring policy="KBA" enforced="1" gross="70" net="70.00" netuhist="0.00" netapp="0.00" final="70.00" weighting="0">
	<category type="Time/date" score="70" weight="0">
		<id name="Any time" score="70" met="1" />
	</category>
	<auth orig="200" final="400" />
</scoring>
*/
function handleScoringDisplay(root_scoring) {
	try {
		var thediv = document.getElementById("popup_Scoring");
		if (!root_scoring || !thediv)
			return;
		
		var policy = getXMLAttrStr(root_scoring, "policy");
		var final = getXMLAttrStr(root_scoring, "final");
		var bWeights = (1 == getXMLAttrNum(root_scoring, "weighting") ? true : false);
		var bEnforced = (1 == getXMLAttrNum(root_scoring, "enforced") ? true : false);
		var root_auth = getXMLChildElement(root_scoring, "auth");
		var origauth = getXMLAttrNum(root_auth, "orig");
		var finalauth = getXMLAttrNum(root_auth, "final");
		var inner = "<h2>Credibility Evaluation Details</h2><table width='100%' border='0'><tr><td width='40%'>Final score:</td><td width='60%'>";
		inner += "<span class='boldred'>" + final + "</span></td></tr>";
		inner += "<tr><td>Policy Used:</td><td>" + policy + "</td></tr>";
		inner += "<tr><td>Original Auth Type:</td><td>" + getAuthDesc(origauth) + "</td></tr>";
		inner += "<tr><td>Final Auth Type:</td><td>" + getAuthDesc(finalauth) + "</td></tr>";
		inner += "<tr><td>Final Auth Enforced:</td><td><span class='bold' style='color:#" + (bEnforced ? "0f0" : "f00") + "'>" + (bEnforced ? "YES" : "NO") + "</span></td></tr></table><br/>";
		inner += "<div class='bgwhite'><table width='100%' border='1'><tr><th>Category</th><th>Id</th><th>Pass/Fail</th><th>Score</th></tr>";
		
		var catidx = 0;
		var cat = getXMLChildElement(root_scoring, "category", catidx);
		while (cat) {
			var catscore = getXMLAttrNum(cat, "score");
			var catweight = getXMLAttrStr(cat, "weight");
			inner += "<tr><td class='bold'>" + getXMLAttrStr(cat, "type").toUpperCase() + "</td><td colspan='2'> " + (bWeights ? "(" + catscore + " * " + catweight + "% weight)" : "&nbsp;");
			inner += "<td class='bold align_right'>" + (bWeights ? catweight*catscore/100 : catscore) + "</td></tr>";
			var ididx = 0;
			var id = getXMLChildElement(cat, "id", ididx);
			while (id) {
				var bPass = (1 == getXMLAttrNum(id, "met") ? true : false);
				inner += "<tr><td>&nbsp;</td><td>" + getXMLAttrStr(id, "name") + "</td><td style='text-align:center; color:#" + (bPass ? "0f0'>PASS" : "f00'>FAIL");
				inner += "</td><td style='text-align:right'>" + (bPass ? getXMLAttrStr(id, "score") : "0") + "</td></tr>";
				ididx++;
				id = getXMLChildElement(cat, "id", ididx);
			}
			catidx++;
			cat = getXMLChildElement(root_scoring, "category", catidx);
		}
		
		inner += "</table></div><br><center><input type='button' id='btnScoringClose' class='pgInputBtn' value='Close' onclick='closeScoringPopup()' /></center>";
		setElemContentDirect(inner, thediv);
				
		doPopup("popup_Scoring");
		document.getElementById("btnScoringClose").focus();
	} catch(e) {
		alert(formatException("handleScoringDisplay()", e));
	}	
}


function getAuthDesc(auth) {
	switch(auth) {
		case AUTHTYPE_BLOCKED: 			return "Blocked";
		case AUTHTYPE_TWO_FACTOR: 		return "Two Factor";
		case AUTHTYPE_OTP: 				return "OTP Only";
		case AUTHTYPE_PW_AND_KBA: 		return "KBA (Password & Challenge Answer)";
		case AUTHTYPE_NAME_PASSWORD:	return "Username & Password";
		case AUTHTYPE_KBA:				return "Knowledge-Based Only";
		default: 						return "Unimplemented auth type: " + auth;
	}
}



/*******************************************************************************/
/* CHANGE USERNAME */
/*******************************************************************************/

function showChngUsrPopup(root_chgusr) {
	closeAllPopups();
	clearMainFormErrors();
	setAuthType(PG_AUTHTYPE_CHANGEUSERNAME);
	var frmDest = document.getElementById("ChngUsrForm");
	try {
		doPopup("popup_ChngUsr");
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		frmDest.elements[DEF_FLD_PASSWORD].value = frmMainDisplay.elements[FLD_DSP_PASS].value;
				
		frmDest.elements[DEF_FLD_NEWUSERNAME].value = "";
		frmDest.elements[DEF_FLD_NEWUSERNAME].className = g_defInputClass;
		frmDest.elements[DEF_FLD_NEWUSERNAME].focus();

		var bAsEmail = (1 == getXMLAttrNum(root_chgusr, "email") ? true : false);
		var bOTPVerify = (1 == getXMLAttrNum(root_chgusr, "reqotp") ? true : false);
		setElemContent(getChangeUsernameTitle(), ["ChngUsrTitle"]);
		setElemContent(getChangeUsernameInstr(bAsEmail, bOTPVerify), ["infoChngUsr"]);

		resetChngUsrDialog();
	} catch(e) {
		alert(formatException("showChngUsrPopup()", e));
	}
}


function displayChngUsrStep(root_chngusr) {
	var msg = "";	// Let the main loop handle updating the error div
	try {
		var frm = document.getElementById("ChngUsrForm");
		var step = getXMLAttrStr(root_chngusr, "step");
		
		if ("1" == step) {
		} else if ("2" == step) {
			// Need OTP verification
			frm.elements[DEF_FLD_NEWUSERNAME].disabled = true;
			setElemVisibility(["ChngUsrOTPEntry"], true);
			frm.elements[PG_FLDNAME_OTP].focus();
			msg = getUsernameChangeOTPSentMsg();
		} else if ("3" == step) {
			setElemContent("", ["infoChngUsr", "ErrMsgChngUsr"]);
			setElemVisibility(["fldsChngUsr"], false);
			setMainFields(frm, DEF_FLD_NEWUSERNAME, null);
			msg = getSuccessfulUsernameChangeMsg();
			// 2012-07-25 - Prevent enter key submit
			setAuthType(PG_AUTHTYPE_NOENTERKEYSUBMIT);
		} else {
			alert("Unhandled change username step: " + step);
		}
	} catch (e) {
		alert(formatException("displayChngUsrStep()", e));
	}
	
	return msg;
}


function resetChngUsrDialog() {
	setElemVisibility(["ChngUsrOTPEntry"], false);
	setElemVisibility(["fldsChngUsr"], true);
	document.getElementById("ChngUsrForm").elements[DEF_FLD_NEWUSERNAME].disabled = false;
	document.getElementById("ChngUsrForm").elements[PG_FLDNAME_CHNGUSRSTEP].value = "1";
	setElemContent("", ["ErrMsgChngUsr"]);
}


function closeChngUsr(bSubmit) {
	resetChngUsrDialog();
	// 2012-01-09 - Ternary operator to prevent browser from automatically closing for PG Client
	closePopup('popup_ChngUsr', false, (g_bNoPGDBrowserClose ? false : g_bSideCar), PG_AUTHTYPE_LOGIN);
	if (bSubmit)
		submitLogin();
}



/*******************************************************************************/
/* EMAIL CONFIRMATION */
/*******************************************************************************/

function showEmailConfPopup(root_emailconf) {
	closeAllPopups();
	clearMainFormErrors();
	setAuthType(PG_AUTHTYPE_CONFIRMEMAIL);
	var frmDest = document.getElementById("EmailConfForm");
	try {
		doPopup("popup_EmailConf");
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		frmDest.elements[DEF_FLD_PASSWORD].value = frmMainDisplay.elements[FLD_DSP_PASS].value;
				
		frmDest.elements[PG_FLDNAME_OTP].value = "";
		frmDest.elements[PG_FLDNAME_OTP].className = g_defInputClass;
		frmDest.elements[PG_FLDNAME_OTP].focus();

		var email = getXMLAttrStr(root_emailconf, "email");
		var bRequired = (1 == getXMLAttrNum(root_emailconf, "required") ? true : false);
		setElemContent(getConfirmEmailTitle(), ["EmailConfTitle"]);
		setElemContent(getConfirmEmailInstr(email, bRequired), ["infoEmailConf"]);
		resetEmailConfDialog();
		
		if (!bRequired)
			setElemVisibility(["btnEmailConfCancel"], true);	
	} catch(e) {
		alert(formatException("showEmailConfPopup()", e));
	}
}


function resetEmailConfDialog() {
	setElemVisibility(["fldsEmailConf"], true);
	setElemContent("", ["ErrMsgEmailConf"]);
	setElemVisibility(["btnEmailConfCancel"], false);
	document.getElementById("EmailConfForm").elements["Cancel"].value = "0";
}


function closeEmailConf(bSubmit) {
	resetEmailConfDialog();
	// 2012-01-09 - Ternary operator to prevent browser from automatically closing for PG Client
	closePopup('popup_EmailConf', false, (g_bNoPGDBrowserClose ? false : g_bSideCar), PG_AUTHTYPE_LOGIN);
	if (bSubmit)
		submitLogin();
}


/*******************************************************************************/
/* PHONE CONFIRMATION */
/*******************************************************************************/

function showPhoneConfPopup(root_phoneconf) {
	closeAllPopups();
	clearMainFormErrors();
	setAuthType(PG_AUTHTYPE_CONFIRMPHONE);
	var frmDest = document.getElementById("PhoneConfForm");
	try {
		doPopup("popup_PhoneConf");
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		frmDest.elements[DEF_FLD_PASSWORD].value = frmMainDisplay.elements[FLD_DSP_PASS].value;
				
		frmDest.elements[PG_FLDNAME_OTP].value = "";
		frmDest.elements[PG_FLDNAME_OTP].className = g_defInputClass;
		frmDest.elements[PG_FLDNAME_OTP].focus();

		var phone = getXMLAttrStr(root_phoneconf, "phone");
		var bRequired = (1 == getXMLAttrNum(root_phoneconf, "required") ? true : false);
		setElemContent(getConfirmPhoneTitle(), ["PhoneConfTitle"]);
		setElemContent(getConfirmPhoneInstr(phone, bRequired), ["infoPhoneConf"]);
		resetPhoneConfDialog();
		
		if (!bRequired)
			setElemVisibility(["btnPhoneConfCancel"], true);	
	} catch(e) {
		alert(formatException("showPhoneConfPopup()", e));
	}
}


function resetPhoneConfDialog() {
	setElemVisibility(["fldsPhoneConf"], true);
	setElemContent("", ["ErrMsgPhoneConf"]);
	setElemVisibility(["btnPhoneConfCancel"], false);
	document.getElementById("PhoneConfForm").elements["Cancel"].value = "0";
}


function closePhoneConf(bSubmit) {
	resetPhoneConfDialog();
	// 2012-01-09 - Ternary operator to prevent browser from automatically closing for PG Client
	closePopup('popup_PhoneConf', false, (g_bNoPGDBrowserClose ? false : g_bSideCar), PG_AUTHTYPE_LOGIN);
	if (bSubmit)
		submitLogin();
}



function rememberDeviceClicked(chkbox, bToggleValue) {
	if (bToggleValue)
		chkbox.checked = !chkbox.checked;
	
	var desc = chkbox.form.elements["SaveUADesc"];
	if (0 == desc.value.length) {
		desc.value = getDefaultSaveUADescription();
	}
	setElemVisibility(["spnSaveUADesc2FA", "spnSaveUADescKBA"], chkbox.checked);
	if (chkbox.checked) {
		desc.focus();
		desc.select();
	}
}


/*******************************************************************************/
/* MOBILE APP */
/*******************************************************************************/
function showMobileAppPopup(root) {
	closeAllPopups();
	setAuthType(PG_AUTHTYPE_MOBILEAPP_ENROLL);
	var frmDest = document.getElementById("MobileAppForm");
	try {
		doPopup("popup_MobileApp");
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		frmDest.elements[DEF_FLD_PASSWORD].value = frmMainDisplay.elements[FLD_DSP_PASS].value;	// 2012-07-24 - Carry over any pw value from the main form

		// Hide/reset these before potentially programmatically showing them
		setElemVisibility(["MobileAppSuppressReminders", "spanMobileAppSkipBtn"], false);
		
		/*
		<mobileapp userdesc="{0|1}" deflabel="...">
			<optional suppress="{0|1}"> -OR- <required skipsleft="x">
		</mobileapp>
		*/
		var bRequired = false, bSuppress = false, nSkips = 0;
		var mobile_root = getXMLChildElement(root, "mobileapp");
		if (mobile_root) {
			g_bMobileAppUserDesc = (1 == getXMLAttrNum(mobile_root, "userdesc") ? true : false);
			g_defMobileAppDesc = getXMLElementStr(mobile_root, "deflabel");
			
			var test = getXMLChildElement(mobile_root, "optional");
			if (test) {
				setElemVisibility(["spanMobileAppSkipBtn"], true);
				bSuppress = (getXMLAttrNum(test, "suppress") == 1 ? true : false);
				if (bSuppress)
					setElemVisibility(["MobileAppSuppressReminders"], true);
			} else {
				test = getXMLChildElement(mobile_root, "required");
				bRequired = true;
				nSkips = getXMLAttrNum(test, "skipsleft");
				if (nSkips > 0)
					setElemVisibility(["spanMobileAppSkipBtn"], true);
			}
		}

		frmDest.elements[PG_FLDNAME_OTP].className = g_defInputClass;
		frmDest.elements[PG_FLDNAME_ACCTSTEP].value = "1";
		frmDest.elements[PG_FLDNAME_MOBILEAPPDESC].value = g_defMobileAppDesc;
		setElemContent(getMobileAppInstr(0, g_bMobileAppUserDesc, bRequired, bSuppress, nSkips), ["infoMobileApp1"]);
		setElemContent("", ["ErrMsgMobileApp", "dspMobileAppSecret"]);
		setElemVisibility(["fldMobileAppDesc"], g_bMobileAppUserDesc);
		setElemVisibility(["infoMobileApp1", "fldsMobileAppInit", "btnsMobileApp"], true);
		setElemVisibility(["infoMobileApp2", "imgMobileAppQRCode", "dspMobileAppSecret", "fldsMobileAppOTP"], false);
		try {	// 2014-01-22 - IE8 throws when the field is not visible
			frmDest.elements[PG_FLDNAME_PHONETYPE].focus();
		} catch(e) {}
	} catch(e) {
		alert(formatException("showMobileAppPopup()", e));
	}
}

function submitMobileAppEnable() {
	var frm = document.getElementById("MobileAppForm");
	var thediv = document.getElementById("ErrMsgMobileApp");
	setAuthType(PG_AUTHTYPE_MOBILEAPP_ENROLL);	
	doWSPAuth(frm, thediv, "checkMobileAppXML");
}

function commonXMLProcessing(frm, strResp, root_name) {
	toggleInputFields(frm, false);
	
	// Reset this to allow other requests
	g_bNoSubmit = false;
	
	if (strResp != "") {
		if (DEBUG)
			alert("Response length: " + strResp.length + "\nResponse: '" + strResp + "'");

		try {
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(strResp, "text/xml");
		} catch(e) {
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		  	xmlDoc.async = "false";
		  	xmlDoc.loadXML(strResp);  
		}
		
		return getXMLChildElement(xmlDoc, root_name);
	} else {
		alert("commonXMLProcessing(): Blank response from PortalGuard agent!");
	}
	
	return null;
}

function checkMobileAppXML(frm, strResp, thediv) {
	var root = commonXMLProcessing(frm, strResp, "pg_return");
	if (null != root) {
		var fld = "", msg = "";
		var step = frm.elements[PG_FLDNAME_ACCTSTEP].value;
		var maj_err = getXMLElementNum(root, "maj_error");
		var root_min = getXMLChildElement(root, "min_errors");
		var min_errs = getXMLAttrNum(root_min, "count");
		var bOTPNeeded = (null == getXMLChildElement(root, "otp_needed") ? false : true);
		var root_otp = null;
		if (bOTPNeeded)
			root_otp = getXMLChildElement(root, "otp_needed");

		if (0 == min_errs) {
			if ("1" == step) {
				setElemVisibility(["fldsMobileAppInit", "imgMobileAppQRCode", "dspMobileAppSecret"], false);
				
				var secret = getXMLElementStr(root, "matseed");
				var bSupportsQR = (secret.length > 0 ? true : false);
				setElemContent(getMobileAppInstr(1, bSupportsQR, false, false, 0), ["infoMobileApp1"]);
				if (bSupportsQR) {
					var qrimg = document.getElementById("qrcode");
					if (null != qrimg) {
						var imgsrc = "data:image/png;base64," + secret;
						qrimg.setAttribute("src", imgsrc);
					}
					setElemVisibility(["imgMobileAppQRCode"], true);
				} else {
					secret = getXMLElementStr(root, "mattext");	// 2013-09-18 - Diff element for text display
					setElemContent(formatMobileAppSecret(secret), ["dspMobileAppSecret"]);
					setElemVisibility(["dspMobileAppSecret"], true);
				}
				
				setElemVisibility(["infoMobileApp2", "fldsMobileAppOTP"], true);
				frm.elements[PG_FLDNAME_ACCTSTEP].value = "2";
				frm.elements[PG_FLDNAME_OTP].focus();
			} else if ("2" == step) {
				setElemVisibility(["infoMobileApp1", "fldsMobileAppInit", "infoMobileApp2", "imgMobileAppQRCode", "dspMobileAppSecret", "fldsMobileAppOTP", "btnsMobileApp"], false);
				msg = getSuccessfulMobileAppLoginEnrollment();
				setAuthType(PG_AUTHTYPE_NOENTERKEYSUBMIT);
			}
			
		} else {
			for (var i = 0; i < min_errs; i++) {
				var min_err = getXMLElementNum(root_min, "min_error", i);
				if (DEBUG)
					alert("Min_error[" + i + "]: " + min_err);

				switch(min_err) {
					case PGAPI_RC_INVALID_INPUT:
						msg = getMobileAppBadLabel();
						fld = PG_FLDNAME_MOBILEAPPDESC;
						break;

					case PGAPI_RC_OTP_MISSING:
						msg = getMissingOTPMsg();
						fld = PG_FLDNAME_OTP;;
						break;

					case PGAPI_RC_OTP_BAD:
						msg = getBadOTPMsg(0, 0, 0);	// No strike information
						fld = PG_FLDNAME_OTP;
						break;

					case PGAPI_RC_OTP_STRIKE:
						var root_lockout = getXMLChildElement(root, "lockout");
						var strikes = getXMLElementNum(root_lockout, "strikes");
						var strikesleft = getXMLElementNum(root_lockout, "strikesleft");
						var expSecs = getXMLElementNum(root_lockout, "exp_secs");

						msg = getBadOTPMsg(strikes, strikesleft, expSecs);
						fld = PG_FLDNAME_OTP;
						break;

					case PGAPI_RC_OTP_EXPIRED:
						msg = getExpiredOTPMsg();
						fld = PG_FLDNAME_OTP;
						break;

					case PGAPI_RC_INTERNAL_ERROR:
						msg = getInternalErrorMsg();
						break;

					case PGAPI_RC_DOCUMENT_NOT_SAVED:
						msg = getDocumentNotSavedMsg();
						break;

					case PGAPI_RC_BAD_REQUEST_TYPE:
						msg = getUnsupportedMsg();
						break;
						
					case PGAPI_RC_BAD_REQUEST_FORMAT:
						msg = getBadRequestMsg();
						break;

					default:
						msg = getGenErrorMsg(min_err);
						break;
				}
			}
		}

		if (fld.length > 0) {
			try {
				eval("frm." + fld + ".focus();");
				eval("frm." + fld + ".select();");
				eval("frm." + fld + ".className='" + g_defInputClass + " errorfield';");
			} catch (e) {}
		}

		// Prints the error message -OR- clears any current error
		setElemContentDirect(msg, thediv);
		if (msg.length > 0)
			thediv.scrollIntoView(true);
	} else {
		alert("checkMobileAppXML(): Blank response from PortalGuard agent!");
	}
}

function submitFromMobileApp() {
	closeMobileApp(false);
	submitLogin();
}

function closeMobileApp(bSkip) {
	// Reset placeholder image
	document.getElementById("qrcode").src = "/_layouts/images/pg/images/qr_placeholder.png";
	
	var frmDest = document.getElementById("MobileAppForm");
	frmDest.elements[PG_FLDNAME_OTP].value = "";
	frmDest.elements[PG_FLDNAME_ACCTSTEP].value = "1";
	// 2012-01-09 - Ternary operator to prevent browser from automatically closing for PG Client
	closePopup('popup_MobileApp', false, (g_bNoPGDBrowserClose ? false : g_bSideCar), PG_AUTHTYPE_LOGIN);
	
	// Try to auto-submit the login form for them
	if (bSkip) {
		skipMobileAppEnrollmentCookie();
		// The main logon form is the one that's actually submitted to the server
		if (document.getElementById("chkDisableRemindersMobileApp").checked)
			frmMainDisplay.elements["DisableEnrollmentReminders"].value = "1";
		else
			frmMainDisplay.elements["DisableEnrollmentReminders"].value = "0";
		submitLogin();
	}
}


/*******************************************************************************/
/* GENERIC */
/*******************************************************************************/

function setRadioAction(id) {
	if (!document.getElementById(id).disabled)	// 2012-09-07 - Only proceed if the associated radio button is actually enabled
		document.getElementById(id).checked = true;
}

function setAuthType(inVal) {
	AUTHTYPE = inVal;
}


function clearMainFormErrors() {
	setElemContent("", ["ErrMsgLogin"]);
	frmMainDisplay.elements[FLD_DSP_USER].className = frmMainDisplay.elements[FLD_DSP_PASS].className = g_defInputClass;
}
		
	
function closeAllPopups() {
	closePopup("popup_SetPW", false);
	closePopup("popup_LoginCA", false);
	closePopup("popup_TOU", false);
	closePopup("popup_OTPEnroll", false);
	closePopup("popup_OTPEntry", false);
	closePopup("popup_OTPResend", false);
	closePopup("popup_SS", false);
	closePopup("popup_AcctLink", false);	
	closePopup("popup_ChngUsr", false);
	closePopup("popup_MobileApp", false);
	closePopup("popup_PhoneConf", false);
	closePopup("popup_EmailConf", false);
	closePopup("popup_2FAGrp", false);
	closePopup("popup_NetAUP", false);
	closePopup("popup_Scoring", false);
	closePopup("popup_BKMobile", false);
	cancelAsyncOp();	// 2021-03-30 - Cancel any pending ops!
}


function showSSPopup(ssstep, ssaction, ssauth) {
	closeAllPopups();
	clearMainFormErrors();	
	var frmDest = document.getElementById("SSForm");
	try {
		doPopup("popup_SS");
		
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		try {
			frmDest.elements[PG_FLDNAME_OTP].value = document.forms[PG_FORM_OTPENTRY].elements[PG_FLDNAME_OTP].value;
		} catch (e) {}
		
		// 2012-09-17 - Reset SMS field and hidden fields
		setRadioAction("SSPhoneCanSMSYes"); 
		setElemVisibility(["divPhoneProvSS"], true);
		
		// Initialization stuff
		setElemContent("", ["ErrMsgSS", "SSRecoveryActions"]);
		setElemVisibility(["SSChooseAction"], false);
		
		setElemVisibility(["SSUsername", "btnSS"], true);	// Reset the necessary elements if they were hidden from a previous SS!
		frmDest.elements[DEF_FLD_USERNAME].className = g_defInputClass;
		frmDest.elements[DEF_FLD_USERNAME].disabled = false;
		frmDest.elements[DEF_FLD_USERNAME].focus();
		
		setAuthType(PG_AUTHTYPE_SS);
		frmDest.elements[PG_FLDNAME_SSSTEP].value = "1";	// Start SS to get Actions
		setElemContent(getSSTitle(), ["SSTitle"]);
		setElemContent(getSSInitialInstr(), ["infoSS"]);
		
		if (ssstep) {
			frmDest.elements[PG_FLDNAME_SSSTEP].value = ssstep;
			
			// Unspeakable horrors: these fields are dynamically created in the DOM...
			if (ssaction) {
				var theid = PG_FLDNAME_SSACTION + ssaction;
				var inner = "<input type='radio' name='" + PG_FLDNAME_SSACTION + "' id='" + theid + "' value='" + ssaction + "' checked />";
				setElemContent(inner, ["SSRecoveryActions"]);
				setElemContent(getSSDisplayValue(parseInt(ssaction, 10)), ["SSActionChosen_Desc"]);
			}
			
			if (ssauth) {
				var theid = PG_FLDNAME_SSAUTH + ssauth;
				var inner = "<input type='radio' name='" + PG_FLDNAME_SSAUTH + "' id='" + theid + "' value='" + ssauth + "' checked />";
				setElemContent(inner, ["SSEnrollmentAuth"]);
			}
		}
		
		// Auto-submit the form if required input(s) are present
		if (frmDest.elements[DEF_FLD_USERNAME].value.length > 0)
			submitSS();

	} catch(e) {
		alert(formatException("showSSPopup()", e));
	}
}


function showLoginCAPopup(root_chal) {
	closeAllPopups();
	clearMainFormErrors();
	setAuthType(PG_AUTHTYPE_LOGIN_ANS);
	var frmDest = document.getElementById("LoginCAForm");
	try {
		doPopup("popup_LoginCA");
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		frmDest.elements[DEF_FLD_PASSWORD].value = frmMainDisplay.elements[FLD_DSP_PASS].value;
		try {
			frmDest.elements[PG_FLDNAME_OTP].value = document.forms[PG_FORM_OTPENTRY].elements[PG_FLDNAME_OTP].value;
		} catch (e) {}
	
		// 2014-01-30 - Need to handle dynamic creation (or unhiding?) of question labels and fields
		var root_qs = getXMLChildElement(root_chal, "required_for_login");
		// Hide all of the "extras" by default
		for (var i = 2; i <= MAX_CHALLOGIN_ANS; i++)
			setElemVisibility(["divLoginCA" + i], false);
			
		for (var i = 0; i < root_qs.childNodes.length; i++) {
			setElemVisibility(["divLoginCA" + (i+1)], true);
			// 2014-01-30 - Question text comes directly from the XML response now...
			// 2015-09-16 - Fix for translated question text
			setElemContent(translateQuestionText((i+1), getXMLElementData(root_qs, "question", i)), ["lblLoginCA" + (i+1)]);
			frmDest.elements[DEF_FLD_LOGINANS + (i+1)].value = "";
			frmDest.elements[DEF_FLD_LOGINANS + (i+1)].className = g_defInputClass;
		}
		
		// Put focus in first answer field
		frmDest.elements[DEF_FLD_LOGINANS + "1"].focus();
		setElemContent("", ["ErrMsgCA"]);
		setElemContent(getKBALoginInstr(), ["infoLoginCA"]);
		
		var saveua_root = getXMLChildElement(root_chal, "saveua");
		if (null == saveua_root) {
			setElemVisibility(["spnSaveUAKBA"], false);
		} else {
			setElemVisibility(["spnSaveUAKBA"], true);
			g_hostname = getXMLElementStr(saveua_root, "host");
		}			
	} catch(e) {
		alert(formatException("showLoginCAPopup()", e));
	}
}


function showTOUPopup() {
	closeAllPopups();
	clearMainFormErrors();
	setAuthType(PG_AUTHTYPE_TOU);
	try {	
		doPopup("popup_TOU", true);
		
		document.getElementById("btnTOUAccept").focus();	// 2017-12-13 - Focus removed from user or pw field on main form
		// Hide the decline button if PGClient
		if (g_bPGClient){
			document.getElementById("btnTOUDecline").style.display = 'none';			
		}
	} catch(e) {
		alert(formatException("showTOUPopup()", e));
	}
}


function showStaticPWLogin() {
	closeAllPopups();
	clearMainFormErrors();
	setAuthType(PG_AUTHTYPE_LOGIN);
	var frmDest = frmMainLogon;
	try {
		setElemVisibility(["btnFirstContinue"], false);
		setElemVisibility(["fldStaticPWLogin", "btnStaticPWLogin"], true);
		try {
			frmDest.elements[FLD_DSP_PASS].focus();
		} catch (e) {}
		frmDest.elements[FLD_DSP_USER].className = frmDest.elements[FLD_DSP_PASS].className = g_defInputClass;
		setElemContent("", ["ErrMsgLogin"]);
		setElemContent(getLoginEnterPWInstr(), ["infoLogin"]);
		
		if (g_bSideCar) {
			// Auto-submit the form if required input(s) are present
			if (frmDest.elements[FLD_DSP_USER].value.length > 0 && frmDest.elements[FLD_DSP_PASS].value.length > 0)
				submitLogin();
		}
	} catch(e) {
		alert(formatException("showStaticPWLogin()", e));
	}
}


function showOTPEnroll() {
	closeAllPopups();
	clearMainFormErrors();
	setAuthType(PG_AUTHTYPE_OTPENROLL);
	var frmDest = document.getElementById("OTPEnrollForm");
	try {
		var thetype = parseInt(frmDest.elements["OTPEnrollType"].value, 10);
		var	bForEmail = false;
		if (AUTHTYPE_2FA_METHOD_EMAIL == thetype)
			bForEmail = true;
		
		doPopup("popup_OTPEnroll");
		
		// 2013-01-21 - Hide both containers
		setElemVisibility(["spanOTPEnrollPhone", "spanOTPEnrollEmail"], false);
		
		setElemContent(getOTPEnrollTitle(thetype), ["lblOTPEnrollTitle"]);
		setElemContent(getOTPEnrollInstr(thetype), ["infoOTPEnroll"]);	

		if (bForEmail) {
			setElemVisibility(["spanOTPEnrollEmail"], true);
		} else {
			setElemVisibility(["spanOTPEnrollPhone"], true);
	
			// 2012-09-17 - Reset SMS field and hidden fields
			setRadioAction('OTPEnrollPhoneCanSMSYes'); 
			setElemVisibility(['divPhoneProvOTPEnroll'], g_bNeedPhoneProvider);		
		}			
		
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		frmDest.elements[DEF_FLD_PASSWORD].value = frmMainDisplay.elements[FLD_DSP_PASS].value;	// 2012-07-24 - Carry over any pw value from the main form
		if (frmDest.elements[DEF_FLD_PASSWORD].value.length > 0)
			if (bForEmail)
				frmDest.elements[PG_FLDNAME_EMAIL].focus();
			else
				frmDest.elements[PG_FLDNAME_PHONE].focus();
		else
			frmDest.elements[DEF_FLD_PASSWORD].focus();
		
		frmDest.elements[DEF_FLD_USERNAME].className = frmDest.elements[DEF_FLD_PASSWORD].className = frmDest.elements[PG_FLDNAME_PHONE].className = g_defInputClass;
		setElemContent("", ["ErrMsgOTPEnroll"]);
	} catch(e) {
		alert(formatException("showOTPEnroll()", e));
	}
}


function radioCanSMSSelected(nmClicked) {
	//setRadioAction(nmClicked);
	if (g_bNeedPhoneProvider) {
		var bCanSMS = false;
		if ("OTPEnrollPhoneCanSMSYes" == nmClicked || "SSPhoneCanSMSYes" == nmClicked)
			bCanSMS = true;
		setElemVisibility(['divPhoneProvOTPEnroll'], bCanSMS);
		// 2015-08-13 - For phone enrollment for SSPR
		if (null != document.getElementById("divPhoneProvSS")) { 
			setElemVisibility(['divPhoneProvSS'], bCanSMS); 
		}
	}
}


function showOTPEntry(b2FA, root_otp) {
	closeAllPopups();
	clearMainFormErrors();
	if (PG_ACCT_CHECKOTP != AUTHTYPE) {
	    setAuthType(PG_AUTHTYPE_OTPENTRY);
	}
	var frmDest = document.getElementById("OTPEntryForm");
	g_b2FA = b2FA;	// Global var used to determine which pw to push into the main form!
	try {
		doPopup("popup_OTPEntry");
		setElemVisibility(["otpEntryStaticPW"], b2FA);
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		frmDest.elements[PG_FLDNAME_OTP].value = "";	// 2012-09-24 - Clear OTP field, for expired OTPs the "expired" OTP was still present
		if (b2FA) {
			frmDest.elements[DEF_FLD_PASSWORD].value = frmMainDisplay.elements[FLD_DSP_PASS].value;
			if (frmDest.elements[DEF_FLD_PASSWORD].value.length > 0)
				frmDest.elements[PG_FLDNAME_OTP].focus();
			else
				frmDest.elements[DEF_FLD_PASSWORD].focus();
				
			// 2012-06-12 - Auto-submit if all values are present
			if (frmDest.elements[DEF_FLD_USERNAME].value.length > 0 &&
				frmDest.elements[DEF_FLD_PASSWORD].value.length > 0 &&
				frmDest.elements[PG_FLDNAME_OTP].value.length > 0) 
			{
				submitOTPEntry();
				return;
			}				
		} else {
			frmDest.elements[PG_FLDNAME_OTP].focus();
		}

		frmDest.elements[DEF_FLD_USERNAME].className = frmDest.elements[DEF_FLD_PASSWORD].className = frmDest.elements[PG_FLDNAME_OTP].className = g_defInputClass;
		setElemContent("", ["ErrMsgOTPEntry"]);
		
		if (null != root_otp) {
			var delivery = getXMLElementNum(root_otp, "delivery");
			var conf = getXMLElementStr(root_otp, "conf");
			var duophone = getXMLElementStr(root_otp, "duophone");	// 2018-05-29 - May be blank...
			var voicebiophrase = getXMLElementStr(root_otp, "voicebiophrase");	// 2018-11-05 - May be blank...
			var fidou2f_chal = getXMLElementStr(root_otp, "fidou2f_chal");	// 2018-11-29 - May be blank
			var webauthn_chal = getXMLElementStr(root_otp, "webauthn_chal");	// 2019-05-06 - May be blank
			var authyphone = getXMLElementStr(root_otp, "authyphone");
			setElemContent(getOTPEntryInstr(delivery, conf), ["infoOTPEntry"]);
			promptForOTP("popup_OTPEntry", delivery, duophone, voicebiophrase, authyphone);	// No effect for phone and email delivery types
			// Populate the hidden div with the resend HTML
			setElemContent(getOTPMethodsHTML(root_otp, "OTPEntryForm", (PG_ACCT_CHECKOTP == AUTHTYPE ? "submitMFAOTPEntry()" : "submitOTPEntry()"), "popup_OTPEntry"), ["popup_OTPResend"]);
			
			var theurl = "<a href='javascript:displayOTPResendPopup()'>" + getResendOTPLinkText(delivery) + "</a>";
			setElemContent(theurl, ["spnResendOTPEntry"]);
			
			var saveua_root = getXMLChildElement(root_otp, "saveua");
			if (null == saveua_root) {
				setElemVisibility(["spnSaveUA2FA"], false);
				g_bRememberAvailable = false;
			} else {
				g_bRememberAvailable = true;
				// 2018-06-07 - Hide "remember" checkbox for Duo
				// 2021-03-23 - And for BK Mobile
				if (PG_OTP_DUOPUSH != delivery && PG_OTP_DELIVERY_BKM_PALM != delivery) {
					setElemVisibility(["spnSaveUA2FA"], true);
				}
				g_hostname = getXMLElementStr(saveua_root, "host");				
			}

            // 2018-06-17
			if (PG_ACCT_CHECKOTP == AUTHTYPE) {
			    frmMainLogon.elements[PG_FLDNAME_ACCTSTEP].value = "2";
			}
			
			if (PG_OTP_DELIVERY_FIDOU2F == delivery && fidou2f_chal.length > 0) {
				setTimeout(function() { displayFIDOU2FAuthPrompt(frmDest, fidou2f_chal, "ErrMsgOTPEntry"); }, 1000);
			} else if (PG_OTP_DELIVERY_WEBAUTHN == delivery && webauthn_chal.length > 0) {
				setTimeout(function() { displayWebAuthnAuthPrompt(frmDest, webauthn_chal, "ErrMsgOTPEntry"); }, 1000);
            // 2019-06-20 - Removed call to doWEBkey, was causing double calls to PG-WKinit
			}
		}
		
		// 2019-11-07 - For Wifi authentication, signal if the OTP fields can be cleaned up
		if (null != frmWifiAuth && !g_bRequireNetworkAUP) {
			if (null == frmDest.elements["NetworkAUP"]) {
				addHiddenField(frmDest, "NetworkAUP", "1");
			}
		}
	} catch(e) {
		alert(formatException("showOTPEntry()", e));
	}
}


function displayFIDOU2FAuthPrompt(frmDest, chal, divDsp) {
	var request = JSON.parse(chal);
	var appId = request.appId;
	var challenge = request.challenge;
	var registeredKeys = [{version: request.version, keyHandle: request.keyHandle}];
	if (!(isFirefoxBrowser() || isChromeBrowser())) {
		setElemContent(getFIDOU2FUnsupportedBrowserInstr(), [divDsp]);
	} else {
		setElemContent(getFIDOU2FOperationInstr(), [divDsp]);
		u2f.sign(appId, challenge, registeredKeys, function(data) {
			if (data.hasOwnProperty("errorCode")) {
				console.log("Skipping submit due to error", data);
				setElemContent(getFailedFIDOU2FSignin(data), [divDsp]);
			} else {
				frmDest.elements[PG_FLDNAME_OTP].value = JSON.stringify(data);
				g_bClearOTPValueOnError = true;
				enterKeySubmit();
			}
		}, FIDOU2F_SIGNIN_TIMEOUT);
	}
}


// 2019-05-06
function displayWebAuthnAuthPrompt(frmDest, chal, divDsp) {
	var request = JSON.parse(chal);
	var challenge = request.challenge;
	var desc = request.desc;
	
	if (!isHTTPSConnection()) {
		setElemContent(getWebAuthnRequiresHTTPSInstr()(), [divDsp]);
	} else if (supportsWebAuthn()) {
		setElemContent(getWebAuthnOperationInstr(desc), [divDsp]);
		g_bClearOTPValueOnError = true;
		verifyWebAuthnCred(request, frmDest);			
	} else {
		setElemContent(getWebAuthnUnsupportedBrowserInstr(), [divDsp]);
	}
}


function clearField(fldname) {
	var fld = document.getElementById(fldname);
	if (null != fld) {
		if ("checkbox" == fld.type) {
			if (fld.checked)
				fld.checked = false;
		} else if ("text" == fld.type || "hidden" == fld.type) {
			fld.value = "";
		}
	}
}

		
function promptForOTP(popup_name, otptype, extrainfo, voiceBioPhrase, authyphone) {
	// Div/spans are named differently based on the popup
	// Just want to change the instructions, OTP field label and set the focus in the OTP field
	var nmInstr, nmLabel, frm, nmErrDiv = "";
	var txtInstr = "", txtLabel = "";
	var bUsingExtAuth = false;
	g_isVoiceOTP = false;
	
	// 2019-08-21 - Stop WEB-key polling if it's occuring so it doesn't keep overwriting the instructions/status msg
	if (typeof cancelWK === "function") { cancelWK(); }
		
	setElemVisibility(["fldOTPEntryOTP"], true);
	setElemContent(getOTPEntryTitle(), ["lblOTPEntryTitle"]);
	var btnLogin= document.getElementById("btnOTPEntryLogin");
	if (null != btnLogin) {
		btnLogin.disabled = false;
		setElemVisibility(["fldOTPEntryVoice"], false);
		var voicePhrase = document.getElementById("VoicePhrase");
		voicePhrase.value = "";
		
		var aElement = document.getElementById("spnResendOTPEntry");
		if (null != aElement) {
			aElement = aElement.querySelector('a');
			if (null != aElement) {
				setElemContentDirect(getResendOTPLinkText(otptype), aElement);
			}
		}
	}
	
	// Get the correct elements based on the current popup
	if ("popup_OTPEntry" == popup_name) {
		nmInstr = "infoOTPEntry";
		nmLabel = "lblOTPOTPEntry";
		frm = document.getElementById("OTPEntryForm");
		nmErrDiv = "ErrMsgOTPEntry";
	} else if ("popup_SS" == popup_name) {
		nmInstr = "infoSS";
		nmLabel = "lblOTPSS";
		frm = document.getElementById("SSForm");
		nmErrDiv = "ErrMsgSS";
	} else if ("popup_SetPW" == popup_name) {
		nmInstr = "infoSetPW";
		nmLabel = "lblOTPSetPW";
		frm = document.getElementById("SetPWForm");
		nmErrDiv = "ErrMsgSetPW";
	} else {
		alert("Unexpected popup: " + popup_name + "\nOTP Type: " + otptype);
		return;
	}
	
	// 2018-11-29 - Want to clear out the FIDO U2F prompt
	setElemContent("", [nmErrDiv]);
	
	// 2013-01-24 - Changing the OTP field label is overkill so it's been removed
	// Get the proper text based on the OTP type
	if (PG_OTP_DELIVERY_PRINT == otptype) {
		txtInstr = getInstrEnterPrintOTP();
	} else if (PG_OTP_DELIVERY_HD == otptype) {
		txtInstr = getInstrEnterHDOTP();
	} else if (PG_OTP_YUBIKEY == otptype) {
		txtInstr = getInstrEnterYubiKeyOTP();
	} else if (PG_OTP_DELIVERY_MOBILE == otptype) {
		txtInstr = getInstrEnterMobileAppOTP();
	} else if (PG_OTP_DELIVERY_SMS == otptype) {
	} else if (PG_OTP_DELIVERY_VOICE == otptype) {
	} else if (PG_OTP_DELIVERY_EMAIL == otptype) {
	} else if (PG_OTP_DELIVERY_TTT == otptype) {
		// If TTT is the default type and we're actually prompt the user about it, then they must not be enrolled
		// See if the Help Desk is enabled and display a custom message about that type instead
		txtInstr = getInstrTTTEnrollNeeded();
	} else if (PG_OTP_HOTPTOKEN == otptype) {
		txtInstr = getInstrEnterHOTP();
	} else if (PG_OTP_RSASECURID == otptype) {
		txtInstr = getInstrEnterRSAPasscode();
	} else if (PG_OTP_EXTAUTH == otptype) {
		txtInstr = getInstrEnterExtAuth();
		bUsingExtAuth = true;
		try {
			if ("popup_OTPEntry" == popup_name) {
				showExtAuth("OTPEntryExtAuth");
			} else if ("popup_SS" == popup_name) {
				showExtAuth("SSExtAuth");
			} else if ("popup_SetPW" == popup_name) {
				showExtAuth("SetPWExtAuth");
			}
			frmExtAuth = frm;
			setElemVisibility(["fldOTPEntryOTP", "fldSSOTP", "fldSetPWOTP"], false);
		} catch (e) {}
	} else if (PG_OTP_DUOPUSH == otptype) {
		txtInstr = getInstrAllowDuoPush(extrainfo);
		DuoPushHandler(true, frm, null);
	} else if (PG_OTP_VOICEBIO == otptype) {
		if (null != btnLogin) {
			setElemVisibility(["fldOTPEntryOTP"], false);
			setElemVisibility(["fldOTPEntryVoice"], true);
			setElemContent(getOTPVoiceEntryTitle(), ["lblOTPEntryTitle"]);
		
			btnLogin.disabled = true;
			txtInstr = getInstrEnterVoiceOTP(voiceBioPhrase);
			var voicePhrase = document.getElementById("VoicePhrase");
			voicePhrase.value = voiceBioPhrase;
			g_isVoiceOTP = true;
		} else {
			console.log("promptForOTP(): Voice biometrics not available for this action");
		}
	} else if (PG_OTP_DELIVERY_FIDOU2F == otptype) {
		txtInstr = getInstrUseFIDOU2FToken();
	} else if (PG_OTP_DELIVERY_WEBAUTHN == otptype) {
		txtInstr = getInstrUseWebAuthnToken();
    } else if (PG_OTP_DELIVERY_WEBKEY == otptype) {
        txtInstr = getInstrUseWEBkey();
        doWEBkey(frm, document.getElementById(nmErrDiv));	// 2020-04-24 - Passing element instead of id!
	} else if (PG_OTP_DELIVERY_DUOOTP == otptype) {
		txtInstr = getInstrEnterDuoOTP();
	} else if (PG_OTP_DELIVERY_BKM_PALM == otptype) {
		txtInstr = getInstrBKMobilePush(extrainfo);
		BKMobilePushHandler(true, frm, null);
	} else if (PG_OTP_DELIVERY_AUTHY == otptype) {
		txtInstr = getInstrAuthyPush(authyphone);
		AuthyPushHandler(true, frm, null);
	} else {
		alert("Unexpected OTP Type: " + otptype + "\nPopup: " + popup_name);
		return;
	}
	
	if (!bUsingExtAuth) {
		try {
			setElemVisibility(["fldSSOTP", "fldSetPWOTP"], true);
			if (!g_isVoiceOTP) {
				setElemVisibility(["fldOTPEntryOTP"], true);
			}
			if (!g_bDuoPushAttempted && !g_bBKMobilePushAttempted && !g_bAuthyPushAttempted) {
				if (g_isVoiceOTP) {
					frm[PG_FLDNAME_OTP].value = voiceBioPhrase;
				} else {
					frm[PG_FLDNAME_OTP].value = "";
				}
			}
			hideExtAuth(); 
		} catch (e) {}
	}
		
	if (g_bDuoPushAttempted || g_bBKMobilePushAttempted || g_bAuthyPushAttempted) {
		setElemVisibility(["SSOTPEntry"], true);
		setElemVisibility(["fldSSOTP"], false);
	}
		
	try {
		if (txtInstr.length > 0)
			setElemContent(txtInstr, [nmInstr]);
		if (txtLabel.length > 0)
			setElemContent(txtLabel, [nmLabel]);

		if (txtInstr.length > 0 || txtLabel.length > 0) {
			closeOTPResendPopup();
		}
	} catch (e) {
		alert(formatException("promptForOTP()", e));
	}		
}


function displayOTPResendPopup() {
    g_bOTPResendDisplayed = true; // For handling enter key
    // Show over the top of which ever popup is currently visible - don't close any others
	doPopup("popup_OTPResend", false);
	
	/*try {
		document.getElementById("login").style.display = "none";
		document.getElementById("popup_OTPEntry").style.zIndex = -1;
		document.getElementById("popup_SS").style.zIndex = -1;
		document.getElementById("popup_SetPW").style.zIndex = -1;
	} catch (e) {}*/
	
	try { 
		// Focussing on button prevents enter key submit from other popup and is required for a11y
		document.getElementById("btnCloseResendOTP").focus();
	} catch(e) {}
}


function closeOTPResendPopup() {
	setElemVisibility(["popup_OTPResend"], false);
	g_bOTPResendDisplayed = false;
	
	// 2013-10-22 - Fix for ensuring SS enrollment after 2FA login is on top
	/*document.getElementById("login").style.display = "block";
	document.getElementById("popup_OTPEntry").style.zIndex = 10001;
	document.getElementById("popup_SS").style.zIndex = 10001;
	document.getElementById("popup_SetPW").style.zIndex = 10001;*/
	
	try {
		document.forms["OTPEntryForm"].elements[PG_FLDNAME_OTP].focus();
	} catch (e) {}
	
	try {
		// These don't exist on AcctMgmt page - will fail silently
		if (PG_AUTHTYPE_SS == AUTHTYPE) {
			document.forms["SSForm"].elements[PG_FLDNAME_OTP].focus();
		} else if (PG_AUTHTYPE_SETPW == AUTHTYPE) {
			if (bStandAlonePWChange) {
				setElemVisibility(["blockUI"], false);
			}
			document.forms["SetPWForm"].elements[PG_FLDNAME_OTP].focus();
        } else if (PG_ACCT_CHECKOTP == AUTHTYPE) {
            setElemVisibility(["blockUI"], false);
            frmMainLogon.elements[PG_FLDNAME_OTP].focus();
        }
	} catch(e) {}
}

	
function clearOTPResendFlag(frm) {
	try {
		frm.elements[PG_FLDNAME_OTP_RESENDTYPE].value = PG_OTP_DELIVERY_NONE.toString();	// Clear the resend flag
		frm.elements[PG_FLDNAME_OTP_RESENDIDX].value = "0";
	} catch (ex) {}
}


function resendOTP(frmname, func, dtype, phoneidx) {
	// 2018-12-01 - Need to "restore" dialog a bit
	if (PG_OTP_VOICEBIO == AUTHTYPE) {
		g_isVoiceOTP = false;
		setElemVisibility(["fldOTPEntryOTP"], true);
		setElemVisibility(["fldOTPEntryVoice"], false);
		try {
			document.getElementById("btnOTPEntryLogin").disabled = false;
		} catch (ex) {}
	}
	
	// 2019-08-21 - Stop WEB-key polling if it's occuring so it doesn't keep overwriting the instructions/status msg
	if (typeof cancelWK === "function") { cancelWK(); }
	
	closeOTPResendPopup();
	document.forms[frmname].elements[PG_FLDNAME_OTP_RESENDTYPE].value = dtype;		// PG_OTP_DELIVERY_SMS or PG_OTP_DELIVERY_VOICE
	document.forms[frmname].elements[PG_FLDNAME_OTP_RESENDIDX].value = phoneidx;
	eval(func);
}
	

function showNoLogin() {
	closeAllPopups();
	clearMainFormErrors();
	setAuthType(PG_AUTHTYPE_GETOPTS);
	var frmDest = frmMainLogon;
	try {
		setElemContent("", ["infoLogin"]);
		setElemVisibility(["btnFirstContinue", "fldStaticPWLogin", "btnStaticPWLogin"], false);
		frmDest.elements[FLD_DSP_USER].className = frmDest.elements[FLD_DSP_PASS].className = g_defInputClass;
		setElemContent(getLoginBlockedMsg(), ["ErrMsgLogin"]);
	} catch(e) {
		alert(formatException("showNoLogin()", e));
	}
}


function doPopup(divname, bNoCentering) {
    stretchBlockingDiv();
    if (PG_ACCT_CHECKOTP != AUTHTYPE || g_bOTPResendDisplayed) {
		if (g_bUseAnimations) {
			$('#login').slideUp(JQ_ANIMATE_DURATION, function() { $('#' + divname).slideDown(JQ_ANIMATE_DURATION); });
		} else {
			setElemVisibility(["blockUI", divname], true);
			try { setElemVisibility(["login"], false); } catch(e) {}
		}		
    }
	
	document.body.style.cursor = "default";
	document.getElementById(divname).style.height = "auto";	// 2010-10-19 - See if we can get this to shrink as needed
	
	mainTabControl(true);
}


function closePopup(divname, clearPassword, allowClose, nextAuth) {
	if (!nextAuth)
		setAuthType(defaultAction);
	else
		setAuthType(nextAuth);
	
	/*if (g_bUseAnimations) {
		$('#' + divname).slideUp(JQ_ANIMATE_DURATION, function() { $('#login').slideDown(JQ_ANIMATE_DURATION); });
	} else {*/
		setElemVisibility(["blockUI", divname], false);
		if ("popup_OTPResend" != divname) {
			try { setElemVisibility(["login"], true); } catch(e) {}
		}
	//}
	
	mainTabControl(false);
	
	/*if (clearPassword)
		frmMainDisplay.elements[FLD_DSP_PASS].value = "";*/
	try {
		if (allowClose) {
			if (g_bPGClient)
				closePGClient();
			else if (g_bSideCar)
				parent.closeIframe(false);
		}
	} catch(e) {}
	
	setFormFocus(frmMainDisplay);
}


function closeScoringPopup() {
	setElemVisibility(["popup_Scoring"], false);
	// Show the main form if no other popups are being displayed
	if (PG_AUTHTYPE_LOGIN == AUTHTYPE || PG_AUTHTYPE_GETOPTS == AUTHTYPE)
		setElemVisibility(["blockUI"], false);
}


function preAJAXSubmitHandler(frm) {
	try {
		if (null != g_CAPTCHA) {
			if (2 == g_CAPTCHA.version && g_CAPTCHA.ready) {
				// If CAPTCHA v2 is enabled, we must *manually* add the response field to our child forms
				var theval = grecaptcha.getResponse(g_CAPTCHA.v2ID);	// 2017-04-25 - Using the identifier in case we render multiple in a single session
				if (theval.length > 0) {
					if (frm[RECAPTCHA_RESP]) {
						frm[RECAPTCHA_RESP].value = theval;
					} else {
						addHiddenField(frm, RECAPTCHA_RESP, theval);
					}
				}
			}
		}
	} catch(e) {
		console.log(formatException("preAJAXSubmitHandler()", e));
	}
}

function submitLogin() {
	var thediv = document.getElementById("ErrMsgLogin");
	setAuthType(PG_AUTHTYPE_LOGIN);
	try {
		if (!preLoginHandler(frmMainDisplay, thediv))
			return;
	} catch(e) {
		console.log(formatException("submitLogin()", e));
	}
	doWSPAuth(frmMainDisplay, thediv);
}

function doFIDO2PWLess() {
	frmMainDisplay.elements[FLD_DSP_PASS].value = "";
	if (null == frmMainDisplay.elements["FIDO2PWLess"]) {
		addHiddenField(frmMainDisplay, "FIDO2PWLess", "1");
	} else {
		frmMainDisplay.elements["FIDO2PWLess"].value = "1";
	}
	submitFIDO2PWLess();
}

function submitFIDO2PWLess() {
	var thediv = document.getElementById("ErrMsgLogin");
	setAuthType(PG_AUTHTYPE_FIDO2_PASSWORDLESS);
	// No password to check in the prelogin handler!
	doWSPAuth(frmMainDisplay, thediv);
}

function submitSetPW() {
	var frm = document.getElementById("SetPWForm");
	var thediv = document.getElementById("ErrMsgSetPW");
	setAuthType(PG_AUTHTYPE_SETPW);
	try {
		// 2016-12-20 - Prevent submittal of new passwords that start with '<' - IIS sees it as injection
		if (!preSetPasswordHandler(frm, thediv))
			return;
	} catch(e) {
		console.log(formatException("submitSetPW()", e));
	}
	doWSPAuth(frm, thediv);
}


function submitLoginCA() {
	var frm = document.getElementById("LoginCAForm");
	var thediv = document.getElementById("ErrMsgCA");
	setAuthType(PG_AUTHTYPE_LOGIN_ANS);	
	doWSPAuth(frm, thediv);
}


function submitTermsOfUse(bAccept) {
	var thediv = document.getElementById("ErrMsgLogin");
	closePopup('popup_TOU', false);
	if (bAccept)
		frmMainDisplay.TOUAction.value = "1";
	else
		frmMainDisplay.TOUAction.value = "0";	
	setAuthType(PG_AUTHTYPE_TOU);
	doWSPAuth(frmMainDisplay, thediv);
}


function submitStaticPW() {
	var frm = document.getElementById("StaticPWLoginForm");
	var thediv = document.getElementById("ErrMsgStaticPW");
	setAuthType(PG_AUTHTYPE_LOGIN);	
	doWSPAuth(frm, thediv);
}


function submitGetOptions() {
	var thediv = document.getElementById("ErrMsgLogin");
	setAuthType(PG_AUTHTYPE_GETOPTS);
	doWSPAuth(frmMainDisplay, thediv);
}


function submitOTPEnroll() {
	var frm = document.getElementById("OTPEnrollForm");
	var thediv = document.getElementById("ErrMsgOTPEnroll");
	cleanEmailAddress(frm);
	setAuthType(PG_AUTHTYPE_OTPENROLL);	
	doWSPAuth(frm, thediv);	
}


function submitOTPEntry() {
	var frm = document.getElementById("OTPEntryForm");
	var thediv = document.getElementById("ErrMsgOTPEntry");
	setAuthType(PG_AUTHTYPE_OTPENTRY);
	doWSPAuth(frm, thediv);	
}


function closeOTPEntry() {
	var frm = document.getElementById("OTPEntryForm");
	// 2014-08-15 - Clear any previous OTP so it's not pre-validated if they try clicking Login button again
	frm.elements[PG_FLDNAME_OTP].value = "";
	frmMainDisplay.elements[PG_FLDNAME_OTP].value = "";
	closePopup('popup_OTPEntry', false, g_bSideCar);
}
	

function submitSS() {
	hideSSReason();
	var frm = document.getElementById("SSForm");
	var thediv = document.getElementById("ErrMsgSS");
	cleanEmailAddress(frm);
	setAuthType(PG_AUTHTYPE_SS);
	if (!areQuestionChoicesValid())
		return;
	try {
		if (!preResetPasswordHandler(frm, thediv))
			return;
	} catch(e) {
		console.log(formatException("submitSS()", e));
	}
	doWSPAuth(frm, thediv);	
}

function cleanEmailAddress(frm) {
	var fld = frm.Email;	// Field "name" in all forms is standardized as 'Email'
	if (null != fld) {
		fld.value = fld.value.replace(/ /g,'').toLowerCase();	// Remove ALL spaces, cast to lowercase
	}
}

function submitAcctLink() {
	var frm = document.getElementById("AcctLinkForm");
	var thediv = document.getElementById("ErrMsgAcctLink");
	setAuthType(PG_AUTHTYPE_ACCTLINK);	
	doWSPAuth(frm, thediv);	
}


function submitChngUsr() {
	var frm = document.getElementById("ChngUsrForm");
	var thediv = document.getElementById("ErrMsgChngUsr");
	setAuthType(PG_AUTHTYPE_CHANGEUSERNAME);
	doWSPAuth(frm, thediv);
}


function submitEmailConf(bCancel) {
	var frm = document.getElementById("EmailConfForm");
	var thediv = document.getElementById("ErrMsgEmailConf");
	setAuthType(PG_AUTHTYPE_CONFIRMEMAIL);
	frm.elements["Cancel"].value = (bCancel ? "1" : "0");
	doWSPAuth(frm, thediv);
}


function submitPhoneConf(bCancel) {
	var frm = document.getElementById("PhoneConfForm");
	var thediv = document.getElementById("ErrMsgPhoneConf");
	setAuthType(PG_AUTHTYPE_CONFIRMPHONE);
	frm.elements["Cancel"].value = (bCancel ? "1" : "0");
	doWSPAuth(frm, thediv);
}


function cbRECAPTCHAv2OnLoad() { g_CAPTCHA.ready = true; }
function cbRECAPTCHAv2Expired() { g_CAPTCHA.v2Expired = true; }
function cbRECAPTCHAv2OK() { g_CAPTCHA.v2OK = true; }

function PG_CAPTCHA() {
	this.key = "";
	this.theme = "light";
	this.bShown = false;
	this.initDiv = "";
	this.version = 2;
	this.ready = false;
	this.v2OK = false;
	this.v2Expired = false;
	this.v2ID = "";
}


function showRecaptcha(bShow, bFocusCAPTCHA) {
	// Determine parent and target element based on current auth type
	var parentelem = "", targetelement = "";
	switch (AUTHTYPE) {
		case PG_AUTHTYPE_LOGIN:
			parentelem = "spnCaptchaLogin"; targetelement = "divCaptchaLogin";
			break;
		case PG_AUTHTYPE_SETPW:
			parentelem = "spnCaptchaSetPW"; targetelement = "divCaptchaSetPW";
			break;
		case PG_AUTHTYPE_OTPENROLL:
			parentelem = "spnCaptchaOTPEnroll"; targetelement = "divCaptchaOTPEnroll";
			break;
		case PG_AUTHTYPE_OTPENTRY:
			parentelem = "spnCaptchaOTPEntry"; targetelement = "divCaptchaOTPEntry";
			break;
		case PG_AUTHTYPE_SS:
			parentelem = "spnCaptchaSS"; targetelement = "divCaptchaSS";
			break;
		case PG_AUTHTYPE_ACCTLINK:
			parentelem = "spnCaptchaAcctLink"; targetelement = "divCaptchaAcctLink";
			break;
		case PG_AUTHTYPE_CHANGEUSERNAME:
			parentelem = "spnCaptchaChngUsr"; targetelement = "divCaptchaChngUsr";
			break;
		case PG_AUTHTYPE_SELFREG:
			parentelem = "fldsCaptchaRegister"; targetelement = "divCaptchaRegister";
			break;
		case PG_AUTHTYPE_FORGOTUSER:
			parentelem = "fldsCaptchaForgotUser"; targetelement = "divCaptchaForgotUser";
			break;
		case PG_AUTHTYPE_ACTIVATEUSER:
			parentelem = "fldsCaptchaActivateUser"; targetelement = "divCaptchaActivateUser";
			break;
		default:
			parentelem = "spnCaptchaSS"; targetelement = "divCaptchaSS";
			break;
	}
	
	if (bShow) {
		// 2017-04-25 - Fix for showing CAPTCHA on a different dialog during the same login session
		if (g_CAPTCHA.bShown && g_CAPTCHA.initDiv == targetelement) {
			try {
				if (bFocusCAPTCHA) {
					g_bFocusCAPTCHA = false;
				}
			} catch (e) {}
		} else {
			try {
				if (2 == g_CAPTCHA.version && !g_CAPTCHA.v2OK) {
					if (g_CAPTCHA.ready) {
						g_CAPTCHA.v2ID = grecaptcha.render(targetelement, {"sitekey": g_CAPTCHA.key, "theme":g_CAPTCHA.theme, "callback":cbRECAPTCHAv2OK, "expired-callback":cbRECAPTCHAv2Expired });
					} else {
						setTimeout("showRecaptcha(true, false)", 250);
						return;
					}
				}
				setElemVisibility([parentelem], true);
				g_CAPTCHA.bShown = true;
				g_CAPTCHA.initDiv = targetelement;
			} catch (e) {
				alert("Failed to display CAPTCHA - did you uncomment the Google JS line in login.aspx?\n\nError: " + e);
			}
		}
	} else {
		if (PG_AUTHTYPE_SELFREG == AUTHTYPE || PG_AUTHTYPE_FORGOTUSER == AUTHTYPE || PG_AUTHTYPE_ACTIVATEUSER == AUTHTYPE) {
			//g_CAPTCHA.bShown = false;
			setElemVisibility([parentelem], false);
		}
	}
}


function addHiddenField(frm, nm, val) {
	var inp = document.createElement("input");
	inp.setAttribute("type", "hidden");
	inp.setAttribute("name", nm);
	inp.setAttribute("value", val);
	frm.appendChild(inp);
}


function propagateCAPTCHAResponse(frmParent) {
	// Hide all the entry divs as well!
	setElemVisibility(["spnCaptchaLogin", "spnCaptchaSetPW", "spnCaptchaOTPEnroll", "spnCaptchaOTPEntry", "spnCaptchaSS", "spnCaptchaAcctLink", "spnCaptchaChngUsr"], false);
			
	var frms = [frmMainLogon];
	frms.push(document.getElementById("SetPWForm"));
	frms.push(document.getElementById("LoginCAForm"));
	frms.push(document.getElementById("OTPEnrollForm"));
	frms.push(document.getElementById("OTPEntryForm"));
	frms.push(document.getElementById("SSForm"));
	frms.push(document.getElementById("AcctLinkForm"));
	frms.push(document.getElementById("ChngUsrForm"));
	try {
		for (var i = 0; i < frms.length; i++) {
			if (!frms[i][RECAPTCHA_RESP]) {		// If the field doesn't exist
				if (2 == g_CAPTCHA.version && frmParent[RECAPTCHA_RESP].value.length > 0) {
					addHiddenField(frms[i], RECAPTCHA_RESP, frmParent[RECAPTCHA_RESP].value);
				}
			} else {
				if (2 == g_CAPTCHA.version && frmParent[RECAPTCHA_RESP].value.length > 0) {
					frms[i][RECAPTCHA_RESP].value = frmParent[RECAPTCHA_RESP].value;
				}
			}
		}
	} catch (e) {}
}


/*******************************************************************************/
/* ACCOUNT ACTIVATION */
/*******************************************************************************/
function submitActivateUser() {
	var frm = document.getElementById("ActivateUserForm");
	var thediv = document.getElementById("ErrMsgActivateUser");
	setAuthType(PG_AUTHTYPE_ACTIVATEUSER);
	doWSPAuth(frm, thediv, "handleActivateUser");
}


function completeActivation() {
	var dest = getQSVar("ReturnUrl");
	if (0 == dest.length) dest = "/default.aspx";
	var login_url = "/_layouts/PG/login.aspx?ReturnUrl=" + encodeURIComponent(dest);
	login_url += "&pgautopop=" + PG_AUTHTYPE_SS + "&pgautoSSStep=4&pgautoSSAction=" + SS_ACTION_RESETPW + "&pgautoSSAuth=" + SS_AUTH_GENOTP + "&pgautofulluser=" + encodeURIComponent(document.getElementById(DEF_FLD_USERNAME).value);
	
	window.location = login_url;
}


function handleActivateUser(frm, strResp, thediv) {
	var root = null;
	
	toggleInputFields(frm, false);
	
	// Reset this to allow other requests
	g_bNoSubmit = false;
	
	if (strResp != "") {
		if (DEBUG)
			console.log("Response length: " + strResp.length + "\nResponse: '" + strResp + "'");

		try {
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(strResp, "text/xml");
		} catch(e) {
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		  	xmlDoc.async = "false";
		  	xmlDoc.loadXML(strResp);  
		}
		
		root = getXMLChildElement(xmlDoc, "pg_return");
	} else {
		console.log("handleActivateUser(): Blank response from PortalGuard agent!");
	}
	
	if (null != root) {
		var msg = "", fld = "";
		var root_captcha = getXMLChildElement(root, "recaptcha");
		if (root_captcha) {
			if (null == g_CAPTCHA) {
				g_CAPTCHA = new PG_CAPTCHA();
				// Only dynamically load the v2 JS file
				if (2 == getXMLAttrNum(root_captcha, "v")) {
					$.getScript("https://www.google.com/recaptcha/api.js?onload=cbRECAPTCHAv2OnLoad&render=explicit");
				}
			}
			g_CAPTCHA.key = getXMLElementStr(root_captcha, "pubkey");
			g_CAPTCHA.theme = getXMLElementStr(root_captcha, "theme");
			g_CAPTCHA.version = getXMLAttrNum(root_captcha, "v");
			if ("1" == getXMLElementStr(root_captcha, "valid"))
				setElemVisibility(["fldsCaptchaActivateUser"], false);
		}
		
		var maj_err = getXMLElementNum(root, "maj_error");
		try {
			if (PGAPI_RC_ACTIVATEUSER_SUCCESS == maj_err) {
				// Display success!
				setElemVisibility(["fldsActivateUser", "infoActivateUser", "lblActivateUserTitle"], false);
				msg = getActivateUserSuccessMsg(root);
			} else {
				var root_min = getXMLChildElement(root, "min_errors");
				var min_errs = getXMLAttrNum(root_min, "count");
				for (var i = 0; i < min_errs; i++) {
					var min_err = getXMLElementNum(root_min, "min_error", i);
					if (DEBUG)
						console.log("Min_error[" + i + "]: " + min_err);

					switch(min_err) {
						case PGAPI_RC_UNSUPPORTED_FEATURE:
							msg = getUnsupportedMsg();
							break;
					
						case PGAPI_RC_NO_USERNAME_SUPPLIED:
							msg = getBlankUserMsg();
							fld = DEF_FLD_USERNAME;
							break;
							
						case PGAPI_RC_BAD_USER:
							msg = getInvalidUserMsg();
							fld = DEF_FLD_USERNAME;
							break;
					
						case PGAPI_RC_GENERIC_BAD_LOGIN:
							msg = getBadDataGenericMsg();
							break;
							
						case PGAPI_RC_NO_CAPTCHA:
							msg = getMissingCAPTCHAMsg();
							try {
								g_bFocusCAPTCHA = true;
							} catch (e) {}
							break;

						case PGAPI_RC_BAD_CAPTCHA:
							msg = getBadCAPTCHAMsg();
							try {
								Recaptcha.reload();
								g_bFocusCAPTCHA = true;
							} catch (e) {}
							break;
						
						case PGAPI_RC_ACTIVATION_NO_DATA:
							msg = getUnregisteredMsg();
							break;
						
						case PGAPI_RC_OTP_MISSING:
							msg = getMissingOTPMsg();
							fld = PG_FLDNAME_OTP;
							break;

						case PGAPI_RC_OTP_BAD:
							msg = getBadOTPMsg(0, 0, 0);	// No strike information
							fld = PG_FLDNAME_OTP;
							break;

						case PGAPI_RC_OTP_STRIKE:
							var root_lockout = getXMLChildElement(root, "lockout");
							var strikes = getXMLElementNum(root_lockout, "strikes");
							var strikesleft = getXMLElementNum(root_lockout, "strikesleft");
							var expSecs = getXMLElementNum(root_lockout, "exp_secs");
							msg = getBadOTPMsg(strikes, strikesleft, expSecs);
							fld = PG_FLDNAME_OTP;
							break;
							
						case PGAPI_RC_ACTIVATION_EXPIRED_DATA:
							msg = getExpiredActivationDataMsg();
							setElemVisibility(["fldsActivateUser", "infoActivateUser"], false);
							break;
					
						case PGAPI_RC_ACTIVATION_BLANK_FLD:
							// Extra field was missing
							msg = getBlankExtraFieldMsg(root);
							fld = getXMLElementStr(root, "badfield");
							break;
							
						case PGAPI_RC_ACTIVATION_INVALID_FLD:
							// Extra field was incorrect
							msg = getWrongExtraFieldMsg(root);
							fld = getXMLElementStr(root, "badfield");
							break;

						case PGAPI_RC_AUTH_SERVER_UNAVILABLE:
							msg = getServerDownMsg();
							break;

						case PGAPI_RC_UNSUPPORTED_FEATURE:
							msg = getUnsupportedMsg();
							break;
						
						case PGAPI_RC_CONFIG_ERROR:
							msg = getConfigErrorMsg();
							break;
							
						case PGAPI_RC_INTERNAL_ERROR:
							msg = getInternalErrorMsg();
							break;					
											
						default:
							msg = getGenErrorMsg(min_err);
					}
				}				
			}
			
			if (fld.length > 0) {
				try {
					// NOTE: The field name is CASE-sensitive!!
					frm[fld].focus();
					frm[fld].select();
					frm[fld].className = g_defInputClass + " errorfield";
				} catch (e) {
					console.log(formatException("handleActivateUser(): Failed setting focus to field '" + fld + "'", e));
				}
			}
			
			if (g_CAPTCHA) {
				try {
					if (2 == g_CAPTCHA.version) {
						// 2019-01-02 - Fix for reCAPTCHA on secondary pages
						showRecaptcha(!g_CAPTCHA.v2OK, false);
					}
				} catch (e) {}
			}
		
			setElemContentDirect(msg, thediv);
		} catch (e) {
			console.log(formatException("handleActivateUser(): Error parsing XML response", e));
			return "";
		}
	}
	
	return msg;
}


/*******************************************************************************/
/* BIO-KEY MOBILE BIOMETRICS APP */
/*******************************************************************************/
function showBKMobilePopup(root) {
	closeAllPopups();
	setAuthType(PG_AUTHTYPE_BKMOBILE_ENROLL);
	var frmDest = document.getElementById("BKMobileForm");
	try {
		doPopup("popup_BKMobile");
		frmDest.elements[DEF_FLD_USERNAME].value = frmMainDisplay.elements[FLD_DSP_USER].value;
		frmDest.elements[DEF_FLD_PASSWORD].value = frmMainDisplay.elements[FLD_DSP_PASS].value;	// 2012-07-24 - Carry over any pw value from the main form

		frmDest.elements[PG_FLDNAME_ACCTSTEP].value = "1";
		setElemContent(getBKMobileEnrollInstr(), ["infoBKMobile1"]);
		setElemContent("", ["ErrMsgBKMobile", "dspBKMobileSecret"]);
		setElemVisibility(["infoBKMobile1", "fldsBKMobileInit", "btnsBKMobile", "fldsBKMobileOTP"], true);
		setElemVisibility(["infoBKMobile2", "imgBKMobileQRCode", "dspBKMobileSecret"], false);
	} catch(e) {
		console.log(formatException("showBKMobilePopup()", e));
	}
}

function submitBKMobileEnable() {
	var frm = document.getElementById("BKMobileForm");
	var thediv = document.getElementById("ErrMsgBKMobile");
	// 2021-03-26 - If they re-try after an error, must reset the step value
	if (null == g_objAsyncCtrl)
		frm.elements[PG_FLDNAME_ACCTSTEP].value = "1";
	setAuthType(PG_AUTHTYPE_BKMOBILE_ENROLL);
	doWSPAuth(frm, thediv, "checkBKMobileXML");
}

function checkBKMobileXML(frm, strResp, thediv) {
	var root = commonXMLProcesing(frm, strResp, "pg_return");
	if (null != root) {
		var fld = "", msg = "";
		var step = frm.elements[PG_FLDNAME_ACCTSTEP].value;
		var maj_err = getXMLElementNum(root, "maj_error");
		var root_min = getXMLChildElement(root, "min_errors");
		var min_errs = getXMLAttrNum(root_min, "count");
		
		if (0 == min_errs) {
			if ("2" == step) {
				setElemVisibility(["lblBKMobileEnrollTitle", "infoBKMobileEnroll", "imgBKMobileQRCode", "fldsBKMobileEnroll"], false);
				setElemVisibility(["infoBKMobile1", "fldsBKMobileInit", "infoBKMobile2", "imgBKMobileQRCode", "fldsBKMobileOTP", "btnsBKMobile"], false);
				// They can only get here through grouped 2FA enrollment so reset the "make default" fields, just in case
				document.getElementById("MakeMFADefaultOTPEntry").checked = document.getElementById("MakeMFADefaultMobileApp").checked = document.getElementById("MakeMFADefaultBKMobile").checked = false;
				setElemVisibility(["fldsOTPEntryDefMethod", "fldsMobileAppDefMethod", "fldsBKMobileDefMethod"], false);
				
				msg = getSuccessfulBKMobileLoginEnrollment();
				setAuthType(PG_AUTHTYPE_NOENTERKEYSUBMIT);
				cancelAsyncOp();
			}			
		} else {
			for (var i = 0; i < min_errs; i++) {
				var min_err = getXMLElementNum(root_min, "min_error", i);
				if (DEBUG)
					alert("Min_error[" + i + "]: " + min_err);

				switch(min_err) {
					case PGAPI_RC_NO_CA_DEFINED:
						msg = showError("No PortalGuard Root CA", "The PortalGuard server does not have a Root CA generated. This is required step for your admin.");
						break;
						
					case PGAPI_RC_HTTP_CALLOUT_FAILURE:
						msg = showError("", "HTTP callout error");
						cancelAsyncOp();
						break;

					case PGAPI_RC_HTTP_MISSING_RESPONSE:
						msg = showError("", "Missing or incorrect HTTP response");
						cancelAsyncOp();
						break;

					case PGAPI_RC_HTTP_BAD_RESPONSE:
						msg = showError("", "Incorrect or unexpected HTTP response");
						cancelAsyncOp();
						break;
					case PGAPI_RC_SERVICE_ACCT_ISSUE:
						msg = getHostedSvcAccountIssueMsg();
						break;
					
					case PGAPI_RC_ASYNCOP_USE_FAILURE:
						msg = showError("Asynchronous Operation Failed", "There was an unexpected error processing this asynchronous operation. You must restart the operation.");
						cancelAsyncOp();
						break;
						
					case PGAPI_RC_ASYNCOP_KEY_NOT_FOUND:
						msg = showError("Transaction ID Not Found", "The back-end transaction ID associated with this request was not found. You must restart the operation.");
						cancelAsyncOp();
						break;
					
					case PGAPI_RC_TOKEN_ENROLL_NOT_AVAILABLE:
						msg = "You are not allowed to enroll this authentication type";
						break;
						
					case PGAPI_RC_OPERATION_CANCELLED:	// Cancelled according to the server, not our UI
						msg = getBKMobileEnrollCancelledMsg();
						cancelAsyncOp();
						setElemVisibility(["imgBKMobileQRCode"], false);
						break;
						
					case PGAPI_RC_BKMOBILE_TIMEDOUT:
						msg = getBKMobileTimedOutMsg();
						cancelAsyncOp();
						setElemVisibility(["imgBKMobileQRCode"], false);
						break;
						
					case PGAPI_RC_OPERATION_PENDING:
						var txid = getXMLElementStr(root, "txid");
						if (null == g_objAsyncCtrl) {
							g_objAsyncCtrl = new PG_AsyncController(txid, frm, thediv);
						}
						
						// 2021-03-23 - So PG will poll for the status
						frm.elements[PG_FLDNAME_ACCTSTEP].value = "2";
						// Show the QR code (if present)
						var b64QR = getXMLElementStr(root, "matseed");
						var enrollurl = getXMLElementStr(root, "BKM_enrollURL");
						if (null != b64QR && b64QR.length > 0) {
							var qrimg = document.getElementById("bkmqrcode");
							b64QR = "data:image/png;base64," + b64QR;
							qrimg.setAttribute("src", b64QR);
							setElemVisibility(["imgBKMobileQRCode"], true);
														
							// The QR code is not fully visible, bring it into view
							//setTimeout(function() { document.getElementById("fldsBKMobileEnroll").scrollIntoView(true); }, 100);
						}
						
						var debugmsg = getXMLElementStr(root, "BKM_msg");
						if (null != debugmsg && debugmsg.length > 0) {
							console.log("BKM_msg:", debugmsg);							
						}					
						
						// 2020-05-01 - Handling initial auth attempts for secondary actions
						i = min_errs;	// Prevents us from displaying info on any secondary minor errors (e.g. 1415 for SSPR)
						bHadAsyncRetCode = true;
						var iter = g_objAsyncCtrl.tryAgain(function() { submitBKMobileEnable(); });	// 2021-03-26 - Slightly different func name from AcctMgmt
						if (0 != iter) {
							// Block the UI until the full timeout or cancel occurs!
							toggleInputFields(frm, true);
							
							var interval = getXMLElementNum(root, "poll");
							var maxwait = getXMLElementNum(root, "maxwait");
							g_objAsyncCtrl.delay = interval;
							g_objAsyncCtrl.maxTries = maxwait / interval;							
							
							if (iter > 1) {
								// 2021-04-21 - We're not displaying a countdown, so use the same message on re-entry!
								msg = thediv.innerHTML;
							} else {
								msg = getAsyncBKMobileEnrollCheckMsg(iter, maxwait/1000, enrollurl);
							}
							// Custom cleanup function on cancel
							g_objAsyncCtrl.customCancel = function() { 
								toggleInputFields(frm, false);
								//clearBKMobileEnrollFields();
								setElemVisibility(["imgBKMobileQRCode"], false);
								setElemContentDirect(getBKMobileEnrollCancelledMsg(), thediv);
							};
						} else {
							msg = getAsyncOpFailedMsg();
							toggleInputFields(frm, false);
							//clearBKMobileEnrollFields();
							cancelAsyncOp();
						}					
						break;
						
					case PGAPI_RC_INTERNAL_ERROR:
						msg = getInternalErrorMsg();
						break;

					case PGAPI_RC_DOCUMENT_NOT_SAVED:
						msg = getDocumentNotSavedMsg();
						break;

					case PGAPI_RC_BAD_REQUEST_TYPE:
						msg = getUnsupportedMsg();
						break;
						
					case PGAPI_RC_BAD_REQUEST_FORMAT:
						msg = getBadRequestMsg();
						break;

					default:
						msg = getGenErrorMsg(min_err);
						break;
				}
			}
		}

		if (fld.length > 0) {
			try {
				eval("frm." + fld + ".focus();");
				eval("frm." + fld + ".select();");
				eval("frm." + fld + ".className='" + g_defInputClass + " errorfield';");
			} catch (e) {}
		}

		// Prints the error message -OR- clears any current error
		setElemContentDirect(msg, thediv);
		if (msg.length > 0)
			thediv.scrollIntoView(true);
	} else {
		console.log("checkBKMobileXML(): Blank response from PortalGuard agent!");
	}
}

function submitFromBKMobile() {
	closeBKMobile();
	submitLogin();
}

function closeBKMobile() {
	// Reset placeholder image
	document.getElementById("qrcode").src = "/_layouts/images/pg/images/qr_placeholder.png";
	
	var frmDest = document.getElementById("BKMobileForm");
	frmDest.elements[PG_FLDNAME_ACCTSTEP].value = "1";
	// 2012-01-09 - Ternary operator to prevent browser from automatically closing for PG Client
	closePopup('popup_BKMobile', false, (g_bNoPGDBrowserClose ? false : g_bSideCar), PG_AUTHTYPE_LOGIN);
}


function placeCustomVoiceCall() {
	var thediv = document.getElementById("ErrMsgLogin");
	setAuthType(PG_AUTHTYPE_CUSTVOICECALL);	
	doWSPAuth(frmMainDisplay, thediv);
}

function resetATAfterCustomVoiceCall() {
	setAuthType(PG_AUTHTYPE_LOGIN);
}


function enterKeySubmit() {
	// 2017-03-06 - Form behind the OTP resend popup was incorrectly consuming enter
	if (g_bOTPResendDisplayed) {
		try {
			// 2017-03-06 - Chrome isn't closing this dialog when pressing enter, even the button is in focus
			if ("btnCloseResendOTP" == document.activeElement.id) {
				closeOTPResendPopup()
				return;
			}
		} catch(e) {}
	}
	
	// Based on the current value of AUTHTYPE
	switch (AUTHTYPE) {
		case PG_AUTHTYPE_LOGIN:
			submitLogin();
			break;
		case PG_AUTHTYPE_SETPW:
			if (g_MeterMinScore > 0 && g_MeterCurScore < g_MeterMinScore)
				break;
			submitSetPW();
			break;
		case PG_AUTHTYPE_TOU:
			break;
		case PG_AUTHTYPE_LOGIN_ANS:		// Login w/ challenge answer
			submitLoginCA();
			break;
		case PG_AUTHTYPE_GETOPTS:		// Determine how user must login
			submitGetOptions();
			break;
		case PG_AUTHTYPE_OTPENROLL:
			submitOTPEnroll();
			break;
		case PG_AUTHTYPE_OTPENTRY:
			if (g_isVoiceOTP) {
				submitVoiceVerify();
			} else {
				submitOTPEntry();
			}
			break;
		case PG_AUTHTYPE_SS:
			if (null == g_SavedSSRoot)
				submitSS();
			else
				submitSSGroup();
			break;
		case PG_AUTHTYPE_ACCTLINK:
			submitAcctLink();
			break;
		case PG_AUTHTYPE_CHANGEUSERNAME:
			submitChngUsr();
			break;
		case PG_AUTHTYPE_CONFIRMEMAIL:
			submitEmailConf(false);
			break;
		case PG_AUTHTYPE_CONFIRMPHONE:
			submitPhoneConf(false);
			break;
		case PG_AUTHTYPE_MOBILEAPP_ENROLL:
			submitMobileAppEnable();
			break;
        case PG_ACCT_CHECKOTP:
            submitMFAOTPEntry();
			break;
		case PG_AUTHTYPE_GROUP2FAENROLL:
			submit2FAGroup();
			break;
		case PG_AUTHTYPE_NOENTERKEYSUBMIT:
			break;
		case PG_AUTHTYPE_FIDO2_PASSWORDLESS:
			submitFIDO2PWLess();
			break;
		default:
			alert("enterKeySubmit(): Unhandled authtype: " + AUTHTYPE);
	}
}


function closePGClient() {
	try {
		if (isIE6())
			window.opener = null;
		else
			window.open("","_self");
		window.close();
	} catch (e) {}
}


function cbFullPGSubmit() {
	// 2019-10-31
	if (null != frmWifiAuth) {
		try {
			// Copy the username, pw & any OTP into the wireless form
			// NOTE: Using the lowercase names here because Cisco only works with that case.
			//	PG handles this because we are using our "_PG_Login_Field_Username_" go-between
			frmWifiAuth.elements["username"].value = frmMainLogon.elements[FLD_SUBMIT_USER].value;
			frmWifiAuth.elements["password"].value = frmMainLogon.elements[FLD_SUBMIT_PASS].value;
			frmWifiAuth.elements["OTP"].value = frmMainLogon.elements[PG_FLDNAME_OTP].value;
				
			if (g_bRequireNetworkAUP) {
				setElemContent(getWifiAuthenticationTitle(), ["NetAUPTitle"]);
				setElemContent(getWifiAuthenticationBody(), ["NetAUPBody"]);
				doPopup("popup_NetAUP");
			} else {
				frmWifiAuth.submit();
			}
			return;
		} catch (e) {
			console.log(formatException("cbFullPGSubmit(): Error submitting Network AUP form", e));
		}
	}
	
	if (bIsIIS) {
		frmMainLogon.elements['frmLogin$Login'].click();
	} else {
		frmMainLogon.submit();
	}
}

function submitLoginFromPopup() {
	// Both PGClient and Sidecar can be true so check client first!
	if (g_bPGClient) {
		if (DEBUG) alert("PGClient detected - closing browser window");
		closePGClient();
	} else if (g_bSideCar) {
		try {
			parent.closeIframe(true);
		} catch (e) {
			alert(formatException("submitLoginFromPopup() - parent.closeIframe()", e));
		}
	} else if (frmMainLogon) {
		try {
			// 2014-02-01 - Add any found prefix
			if (g_UserPrefix && g_UserPrefix.length > 0) {
				frmMainLogon.elements[FLD_SUBMIT_USER].value = g_UserPrefix + frmMainLogon.elements[FLD_SUBMIT_USER].value;
			}

			if (g_bChromeCredPassing) {
			    var someobj = {};
			    someobj.token = g_forGoogle.token;
			    google.principal.complete(someobj, cbFullPGSubmit);
			} else {
			    cbFullPGSubmit();
			}
		} catch (e) {
			console.log(formatException("submitLoginFromPopup()", e));
		}
	} else {
		alert("submitLoginFromPopup(): frmMainLogon variable never set to a value!");
	}
}


function setAutoSignout(secleftWarning) {
	// Get number of seconds left in session
	var xhr = false;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	try {
		xhr.open("GET", "/ttl.ashx", true);

		// 2014-09-11 - Special handling for iOS to prevent multiple callbacks
		if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
			xhr.onload = function(event) {
				eval("parseTTLResponse(xhr.responseText, secleftWarning)");
			}
		} else {
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) { 
					eval("parseTTLResponse(xhr.responseText, secleftWarning)");
				}
			}
		}
			
		xhr.send(null);
	} catch (e) {
	}	
}

function parseTTLResponse(strResp, secleftWarning) {
	var parser = null;
	var xmlDoc = null;
	
	// Unexpected response, bail
	if (0 != strResp.indexOf("<ttl>")) {
		console.log("Could not find <ttl> element in response - PortalGuard automatic session timeout not possible");
		return;
	}
	
	try {
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(strResp, "text/xml");
	} catch (e) {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(strResp);  
	}
	
	try {
		var ttl_sec = getXMLElementNum(xmlDoc, "ttl");

		if (secleftWarning) {			
            // 2018-03-15 - So this timeout can be used on pages with the more generic "ErrMsg" div
			var elem = (document.getElementById("ErrMsgAcct") ? "ErrMsgAcct" : (document.getElementById("ErrMsgSSOJumpPage") ? "ErrMsgSSOJumpPage" : "ErrMsg"));
			var ttw = ttl_sec - secleftWarning;
			if (ttw < 0) ttw = 0;
			ttw *= 1000;	// Convert to ms, need to check 32-bit limits (~24.9 days)
			if (ttw > 0x7FFFFFFF) ttw = 0x7FFFFFFF;
			setTimeout(function() {
				try {
					setElemContent(getSessionTimeoutWarning(secleftWarning), [elem]);
					document.getElementById(elem).scrollIntoView(true);
				} catch (e) {}
			}, ttw);
		}
		ttl_sec += 2;	// Add two sec buffer until timeout (ensuring the session is expired)
		ttl_sec *= 1000;	// Convert to ms, need to check 32-bit limits
		if (ttl_sec > 0x7FFFFFFF) ttl_sec = 0x7FFFFFFF;
		setTimeout(function() { window.location.reload(true); }, ttl_sec);
	} catch (e) {
	}
}


/* pg_util.js */
var g_popup;

/* 2018-11-09

  Removed the declaration of Event that overrides the JavaScript native Event, was causing problems with voicerecord.js
  
  From Gregg explaning what this was used for originally in verion 3:
  
	Searching the current front-end files for Event.add shows that it is related to the Password Meter feature which showed a colored bar
	reflecting how “good”/complex their new password was.

	This feature has been deprecated so please go ahead and comment out that Event declaration and add a comment 
	with today's date about why it's been commented out.
	
  Overrding the native Event with this one was causing starting a recording to hang in Edge.  Egde does not support MediaRecorder,
  Firfox and Chrome do, so needed to add a Poly Fill for Edge in order to record voice phrases for Voice Biometrics OTP.  The Poly Fill
  uses Event to start a recording.  The following code in voicerecord.js is where the problem was:
  
	  start: function start (timeslice) {
	    if (this.state !== 'inactive') {
	      return this.em.dispatchEvent(error('start'))
	    }

	    this.state = 'recording'

	    if (!context) {
	      context = new AudioContext()
	    }
	    var input = context.createMediaStreamSource(this.stream)
	    var processor = context.createScriptProcessor(2048, 1, 1)

	    var recorder = this
	    processor.onaudioprocess = function (e) {
	      if (recorder.state === 'recording') {
		recorder.encoder.postMessage([
		  'encode', e.inputBuffer.getChannelData(0)
		])
	      }
	    }

	    input.connect(processor)
	    processor.connect(context.destination)

	    this.em.dispatchEvent(new Event('start'))

	    if (timeslice) {
	      this.slicing = setInterval(function () {
		if (recorder.state === 'recording') recorder.requestData()
	      }, timeslice)
	    }

	    return undefined
	  },  

	  
	The line:
	
	    this.em.dispatchEvent(new Event('start'))
		
	Would cuase the browser to go into an infinite loop calling the onaudioproces handler above:
	
	    processor.onaudioprocess = function (e) {
	      if (recorder.state === 'recording') {
		recorder.encoder.postMessage([
		  'encode', e.inputBuffer.getChannelData(0)
		])
	      }
		  
	This would cause the call to start to never return and the recording would never start.
	
var Event = {
	add: function(obj,type,fn) {
		if (obj.attachEvent) {
			obj['e'+type+fn] = fn;
			obj[type+fn] = function() { obj['e'+type+fn](window.event); }
			obj.attachEvent('on'+type,obj[type+fn]);
		} else
		obj.addEventListener(type,fn,false);
	},
	remove: function(obj,type,fn) {
		if (obj.detachEvent) {
			obj.detachEvent('on'+type,obj[type+fn]);
			obj[type+fn] = null;
		} else
		obj.removeEventListener(type,fn,false);
	}
}
*/

function setCookie(name, value, expires, path, secure, domain) {
	var curCookie = name + "=" + escape(value) +
		((expires) ? "; expires=" + expires.toGMTString() : "") +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") +
		((secure) ? "; secure" : "");
	document.cookie = curCookie;
}


function getCookie(name) {
	var dc = document.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);
	if (begin == -1) {
		begin = dc.indexOf(prefix);
		if (begin != 0) return null;
	} else
		begin += 2;
	var end = document.cookie.indexOf(";", begin);
	if (end == -1)
		end = dc.length;
	return unescape(dc.substring(begin + prefix.length, end));
}


function deleteCookie(name, path, domain) {
	if (getCookie(name)) {
		document.cookie = name + "=" +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-1970 00:00:01 GMT";
	}
}


function getDomain() {
	var ret = "", parts = window.location.hostname.split(".");
	for (var i = 1; i < parts.length; i++) {
		ret += "." + parts[i];
	}
	return ret;
}


function pad(inp, padchar, minlen, bInFront) {
	var ret = "" + inp;
	for (var i = minlen - ret.length; i > 0; i--) {
		if (bInFront)
			ret = padchar + ret;
		else
			ret = ret + padchar;
	}
	return ret;
}


/* NOTE: If srch is not found in src, then src is returned unchanged */
function strInsertBefore(src, srch, ins) {
	var lowerSrc = src.toLowerCase();
	var lowerSrch = srch.toLowerCase();
	var idx = lowerSrc.indexOf(lowerSrch);
	if (idx == -1)
		return src;
		
	var ret = src.substr(0, idx) + ins + src.substr(idx);
	return ret;
}

function strLeft(src, srch) {
    var ret = "";
    var pos = src.indexOf(srch);
    if (pos >= 0)
        ret = src.substring(0, pos);
	return ret;
}

function strRight(src, srch) {
    var ret = "";
    var pos = src.indexOf(srch);
    if (pos >= 0)
        ret = src.substring(pos + srch.length);
	return ret;
}

function strBetween(src, mark1, mark2) {
	var ret = "";
	var leftpos = src.indexOf(mark1);
	if (leftpos >= 0) {
		leftpos += mark1.length;
		var rightpos = src.indexOf(mark2, leftpos);
		if (rightpos >= leftpos) {
			ret = src.substring(leftpos, rightpos);
		}
	}
	return ret;
}

function strTrim(x) {
	// 2014-03-20 - IE8 doesn't support string.trim()...
	return x.replace(/^\s+|\s+$/gm,'');
}

function strEndsWith(inp, fnd, bIgnoreCase) {
    var inpLC = (bIgnoreCase ? inp.toLowerCase() : inp);
    var fndLC = (bIgnoreCase ? fnd.toLowerCase() : fnd);
    var pos = inpLC.lastIndexOf(fndLC);
    if (-1 == pos)
        return false;
    var sub = inpLC.substring(pos);
    if (sub.length = fndLC.length)
        return true;
    return false;
}

function strCount(inp, fnd) {
	return (inp.match(new RegExp(fnd, "g")) || []).length;
}

function pgHTMLUnescape(inp, bDoLT) {
	var ret = inp.replace("&quot;", '"');
	ret = ret.replace("&amp;", "&");
	ret = ret.replace("&apos;", "'");
	if (bDoLT)
		ret = ret.replace("&lt;", "<");
	ret = ret.replace("&gt;", ">");
	return ret;
}

function findPosX(obj, bRight) {
	var curleft = (bRight ? obj.clientWidth : 0);	// 2011-04-11 - Tested on IE, FF, Chrome
	if (obj.offsetParent) {
		// 2017-01-24 - Fix for bootstrap nesting of username typeahead div
		curleft += obj.offsetLeft;
		/*while(true) {
			curleft += obj.offsetLeft;
			if (!obj.offsetParent)
				break;
			obj = obj.offsetParent;
		}*/
	} else if (obj.x)
		curleft += obj.x;
	return curleft;
}


function findPosY(obj) {
	var curtop = 0;
	if	(obj.offsetParent) {
		// 2017-01-24 - Fix for bootstrap nesting of username typeahead div
		curtop += obj.offsetTop;
		/*while(true) {
			curtop += obj.offsetTop;
			if (!obj.offsetParent)
				break;
			obj = obj.offsetParent;
		}*/
	} else if (obj.y)
		curtop += obj.y;
	return curtop;
}


function isIEBrowser() {
	var rv = false;
	var ua = navigator.userAgent;
	if (navigator.appName == "Microsoft Internet Explorer") {
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) {
			rv = true;
		} else {
			// 2014-01-28 - IE11 support
			re = new RegExp("Trident/");
			if (re.exec(ua) != null)
				rv = true;
		}
	} else {
		// 2014-01-28 - IE11 support
		re = new RegExp("Trident/");
		if (re.exec(ua) != null)
			rv = true;
	}
	
	return rv;
}


function isChromeBrowser() {
	var rv = false;
	if (navigator.appName == "Netscape") {
		var ua = navigator.userAgent;
		if (ua.indexOf("Edge/") > 0)
			return false;
		var re = new RegExp("(Chrome/)");
		if (re.exec(ua) != null)
			rv = true;
	}
	
	return rv;
}	


function isFirefoxBrowser() {
	var rv = false;
	if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
		rv = true;
	return rv;
}


function isEdgeBrowser(minver) {
	var rv = false;
	if (navigator.userAgent.indexOf("Edge/") > 0) {
		if (typeof minver === "undefined")
			return true;	// No min version provided
		var strver = strBetween(navigator.userAgent, "Edge/", ".");
		if (strver.length > 0) {
			var thever = parseInt(strver, 10);
			if (thever >= minver)
				return true;
		}
	}
	return rv;
}

function isSafariBrowser() {
	var rv = false;
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf('safari') != -1) { 
		if (ua.indexOf('chrome') > -1) {
		} else {
	    	rv = true;
		}
  	}
	return rv;
}


function isIE6() {
	var	bRet = false;
	try {
		if (0 <= navigator.userAgent.indexOf("MSIE 6.0"))
			bRet = true;
	} catch (e) {}
	return bRet;
}


function checkPopupBlocking(url, waittime, dspDivId, func_blocked, func_allowed) {
	var popx = f_clientWidth() / 2;
	var popy = f_clientHeight() / 2;
	var openparams = "height=150,width=150,left=" + popx + ",top=" + popy + ",screenX=" + popx + ",screenY=" + popy;
	if (isChromeBrowser()) {
		g_popup = window.open(url, "new_window_123", openparams);
		setTimeout(function(waittime) {
			if (!g_popup || g_popup.closed || g_popup.closed == "undefined") {
				func_blocked(dspDivId);
			} else {
				func_allowed(waittime);
			}
		}, 500);
	} else {
		// Graveyard for methods that don't work in Chrome
		g_popup = window.open(url, "", openparams);
		if (g_popup == null || typeof(g_popup)=='undefined') {
			func_blocked(dspDivId);
		} else {
			func_allowed(waittime);
		}
	}
}


function toggleInputType(fld) {
	try {
		var newfld = document.createElement("input");
		newfld.type = (fld.type == "text" ? "password" : "text");
		if (fld.size) newfld.size = fld.size;
		if (fld.value) newfld.value = fld.value;
		if (fld.name) newfld.name = fld.name;
		if (fld.id) newfld.id = fld.id;
		if (fld.className) newfld.className = fld.className;
		fld.parentNode.replaceChild(newfld, fld);
		// 2015-12-30 - VK removed, was too small for responsive UI
		//VKI_attach(newfld);	// 2013-06-18 - Ensure VK works for new field
		return newfld;
	} catch (e) {
		var outp = "toggleInputType() error\n=====================\n";
		for (var i in e) {
			outp = outp + i + ": " + e[i] + "\n";
		}
		alert(outp);
	}
}


function togglePwFields(theform, bCheckState) {
	var fldnewpw = null;
	
	// 2012-08-29 - Sync up all "showpw" checkboxes in this form
	for (var i = 0; i < theform.elements.length; i++) {
		if (theform.elements[i].type == "checkbox" && theform.elements[i].id.indexOf("showpws") >=0) {
			theform.elements[i].checked = bCheckState;
		}
	}
	
	// Need to look for specific field names since the type could be text or password depending on the current state!
	if (bIsIIS) {
		// 2013-04-22 - Only peform this if the names are different!
		if (theform.elements[FLD_DSP_PASS] && FLD_DSP_PASS != DEF_FLD_PASSWORD)	{	// The screwy name .NET gives form fields...
			toggleInputType(theform.elements[FLD_DSP_PASS]);
			if (g_bFocusPWFieldWhenToggled) {
				try { theform.elements[FLD_DSP_PASS].focus(); } catch (e) {}		// Fix for IE8 on HP
			}
		}
	}
	if (theform.elements[DEF_FLD_PASSWORD] && !isHidden(theform.elements[DEF_FLD_PASSWORD])) {
		toggleInputType(theform.elements[DEF_FLD_PASSWORD]);
		if (g_bFocusPWFieldWhenToggled) {
			try { theform.elements[DEF_FLD_PASSWORD].focus(); } catch (e) {}	// Password field may not be visible!
		}
	}
	if (theform.elements[DEF_FLD_NEWPW]) {
		var bSetPW = (PG_AUTHTYPE_SETPW == AUTHTYPE ? true : false);
		fldnewpw = toggleInputType(theform.elements[DEF_FLD_NEWPW]);
		if (fldnewpw != null && theform.elements[DEF_FLD_CONFPW]) {
			var bShow = (fldnewpw.type == "text" ? false : true);
			var theSpan = (bSetPW ? "fldConfPWSetPW" : "fldConfPWChal");
			setElemVisibility([theSpan], bShow);
			
			// 2017-01-02 - Re-enable R/T pw quality checking if enabled
			if (g_bPremptivePWRules && g_bRealtimePWQuality)
				initRealtimePWQuality();
		}
		
		// Fix for pw meter
		if (g_bUsePWMeter) {
			// 2018-11-09 - See note for the declartation of Event with same date (2018-11-09) for explanation of why the line below was commenedted out.
			// Event.add(fldnewpw, "keyup", getPWMeterFunc());
		}
	}
	if (theform.elements[PG_FLDNAME_LINKPASS]) {
		toggleInputType(theform.elements[PG_FLDNAME_LINKPASS]);
		if (g_bFocusPWFieldWhenToggled) {
			try { theform.elements[PG_FLDNAME_LINKPASS].focus(); } catch (e) {}	// Password field may not be visible!
		}
	}
	if (theform.elements[PG_FLDNAME_ADDSITEPASS]) {
		toggleInputType(theform.elements[PG_FLDNAME_ADDSITEPASS]);
		if (g_bFocusPWFieldWhenToggled) {
			try { theform.elements[PG_FLDNAME_ADDSITEPASS].focus(); } catch (e) {}	// Password field may not be visible!
		}
	}

	return true;
}


function addFormInputField(frm, name, val, bHidden) {
	var input = document.createElement("input");
	input.type = (bHidden ? "hidden" : "text");
	input.name = name;
	input.value = val;
	frm.appendChild(input);
}


function getFormFieldById(frm, fld) {
	for (var i = 0; i < frm.elements.length; i++) {
		var thefld = frm.elements[i];
		if ((thefld.id && fld == thefld.id) || (thefld.name && fld == thefld.name))
			return thefld;
	}
	return null;
}
	

var PG_AUTO_USER			= "&pgautouser=1";
var PG_AUTO_PASS			= "&pgautopass=1";
var PG_AUTO_POPUP			= "&pgautopop=";
var PG_AUTO_FULLUSERNAME	= "&pgautofulluser=";
var PG_CLIENT_FLAG			= "&pgclient=";
var PG_AUTO_SSSTEP			= "pgautoSSStep";
var PG_AUTO_SSACTION		= "pgautoSSAction";
var PG_AUTO_SSAUTH			= "pgautoSSAuth";
var PG_AUTO_GUID			= "pgautoguid";

// Parse the query string to automate PG's behavior
function PG_Auto(theurl) {
	var pos = 0;	
	var val = "";
	
	// Are we dealing with the PG Client?
	pos = theurl.indexOf(PG_CLIENT_FLAG);
	if (pos >= 0) {
		var term = theurl.indexOf("&", pos + PG_CLIENT_FLAG.length - 1);
		if (-1 == term)
			term = theurl.length;
		val = escape(theurl.substring(pos + PG_CLIENT_FLAG.length, term));

		if (1 == val) {
			g_bPGClient = true;
			if (DEBUG) 
				alert("PortalGuard Client detected");
				
			// 2012-01-09 - We're losing that a PGD is being used, so create a form field if it's there
			try {
	 			document.getElementById("pgclient").value = "1";
	 			document.getElementById("pgclientSS").value = "1";
	 			document.getElementById("pgclientAcctLink").value = "1";
	 		} catch (ex) {
	 			alert("Exception setting 'pgclient' field: " + ex);
	 		}
		}
	}
	
	// Is the username requested?
	pos = theurl.indexOf(PG_AUTO_USER);
	if (pos >= 0) {
		try {
			val = parent.fetchUsername();
			if (DEBUG)
				alert("Auto-populating username: '" + val + "'");
			frmMainDisplay.elements[FLD_DSP_USER].value = val;
		} catch (e) {}
	}

	// 2015-04-24 - Any username provided by O365 login
	pos = theurl.indexOf("?");
	if (pos >= 0) {
		var innerqs = unescape(theurl.substring(pos + 1));
		// 2015-09-24 - Need to handle a username at the beginning of a query string (?) or in the middle (&) - use regex
		var O365_USERNAME = /[\?&]username=/;
		pos = innerqs.search(O365_USERNAME);
		if (pos >= 0) {
			var term = innerqs.indexOf("&", pos + 10 - 1);
			if (-1 == term)
				term = innerqs.length;
			val = unescape(innerqs.substring(pos + 10, term));
			// 2015-05-08 - These next 4 lines will remove the "@domain" value from the username
			/*pos = val.indexOf("@");
			if (pos >= 0) {
				val = val.substring(0, pos);
			}*/
			
			try {
				if (val.length > 0) {
					if (DEBUG)
						alert("Auto-populating Office365 username: '" + val + "'");
					frmMainDisplay.elements[FLD_DSP_USER].value = val;
					frmMainDisplay.elements[FLD_DSP_PASS].focus();
				}
			} catch (e) {}
		}
	}
		
	// Was the username provided in full?
	pos = theurl.indexOf(PG_AUTO_FULLUSERNAME);
	if (pos >= 0) {
		var term = theurl.indexOf("&", pos + PG_AUTO_FULLUSERNAME.length - 1);
		if (-1 == term)
			term = theurl.length;
		val = unescape(theurl.substring(pos + PG_AUTO_FULLUSERNAME.length, term));

		try {
			if (DEBUG)
				alert("Auto-populating username: '" + val + "'");
			frmMainDisplay.elements[FLD_DSP_USER].value = val;
			try {
				frmMainDisplay.elements[FLD_DSP_PASS].focus();
			} catch (e) {}
		} catch (e) {}
	}

	// Is the password requested?
	pos = theurl.indexOf(PG_AUTO_PASS);
	if (pos >= 0) {
		try {
			val = parent.fetchPasssword();
			if (DEBUG)
				alert("Auto-populating password (length: " + val.length + ")");
			frmMainDisplay.elements[FLD_DSP_PASS].value = val;
		} catch (e) {}
	}
	
	// Does AutoGuid exist?
	pos = theurl.indexOf(PG_AUTO_GUID);
	if (pos >= 0) {
		try {
			frmMainDisplay.elements[FLD_DSP_PASS].value = getQSVar(PG_AUTO_GUID);
		} catch (e) {}
	}
	
	// Any params that tell us what pop-up to display?
	pos = theurl.indexOf(PG_AUTO_POPUP);
	if (pos >= 0) {
		var term = theurl.indexOf("&", pos +  PG_AUTO_POPUP.length - 1);
		if (-1 == term)
			term = theurl.length;
		val = unescape(theurl.substring(pos + PG_AUTO_POPUP.length, term));
		var idx = parseInt(val, 10);
		
		if (DEBUG)
			alert("Auto-displaying popup: " + idx);
		
		// Set this *before* doing the popups!
		g_bSideCar = true;

		switch (idx) {
			case PG_AUTHTYPE_LOGIN:		// Only use if sure user logs in with password
				showStaticPWLogin();
				break;
			case PG_AUTHTYPE_SETPW:
				showSetPWPopup(true); 
				break;
			case PG_AUTHTYPE_SETCHAL:
			case PG_AUTHTYPE_GETQS:
			case PG_AUTHTYPE_CHECK_ANS:
				if (g_bPGClient) {
					g_bNoPGDBrowserClose = true;
					showSSEnrollPopup();
				} else {
					alert("pg_util.js - PG_Auto() - In presumed case with idx: " + idx);
					showSSEnrollPopup();
				}
				break;
			case PG_AUTHTYPE_TOU:		
				showTOUPopup(); 
				break;
			case PG_AUTHTYPE_GETQS_ANON:
			case PG_AUTHTYPE_PWREC:
				g_bNoPGDBrowserClose = false;
				showSSPopup();	// 2012-01-09 - Works well for PGD
				break;
			case PG_AUTHTYPE_LOGIN_ANS:
				showLoginCAPopup(null);
				break;
			case PG_AUTHTYPE_OTPENROLL:
				showOTPEnroll();
				break;
			case PG_AUTHTYPE_OTPENTRY:
				showOTPEntry();
				break;
			case PG_AUTHTYPE_SS:
				// 2017-06-26 - Advancing to specific SS dialog
				var ssstep = getQSVar(PG_AUTO_SSSTEP);
				if (ssstep.length > 0) {
					g_bSideCar = false;	// 2017-06-27 - So we don't mess with non-existent parent frames
					var ssaction = getQSVar(PG_AUTO_SSACTION);
					var ssauth = getQSVar(PG_AUTO_SSAUTH);
					showSSPopup(ssstep, ssaction, ssauth);
				} else {
					showSSPopup();
				}
				break;
			case PG_AUTHTYPE_ACCTLINK:
				showAcctLinkEnrollPopup();
				break;
		}
	}				
}	
	

function boolByRef(bDefault) {
	this.value = bDefault;
}


function getQSVar(nm) {
	var query = window.location.search.substring(1);
	return getQSVarExt(nm, query);
}


function getQSVarExt(nm, query) {
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0].toLowerCase() == nm.toLowerCase()) {
			return decodeURIComponent(pair[1]);
		}
	}
	return "";
}


function formatPhone(phone, c) {
	if (c == "DE") {
		return formatWithTemplate("xx xx xxx xxx [DE]", phone);
	} else if (c == "FR") {
		return formatWithTemplate("xxx xxx xxx [FR]", phone);
	} else if (c == "GB") {
		return formatWithTemplate("xx xxxx xxxx [GB]", phone);
	} else if (c == "NO") {
		return formatWithTemplate("xxx xx xxx [NO]", phone);
	} else if (c == "ZA") {
		return formatWithTemplate("0xxxxxxxxx [ZA]", phone);
	} else if (c == "IN") {
		return formatWithTemplate("xx xxxx xxxx [IN]", phone);
	} else if (c == "AU") {	// 2019-09-26
		// 2019-10-29 - Variable formats...
		if (9 == phone.length) {
			return formatWithTemplate("0x xxxx xxxx [AU]", phone);
		} else if (10 == phone.length) {
			return formatWithTemplate("xx xxxx xxxx [AU]", phone);
		} else if (11 == phone.length) {
			return formatWithTemplate("xx 0x xxxx xxxx [AU]", phone);
		} else {
			return phone + " [AU]";
		}
	} else {	// Default is US
		return formatWithTemplate("(xxx) xxx-xxxx [US]", phone);
	}
}


function formatWithTemplate(template, val) {
	// Each 'x' in the template will be replaced with a char from the provided value
	// All other chars in the template are passed through as is
	var ret = "";
	
	// Ensure the number of placeholders matches the number of chars in the value!
	var spots = (template.match(/x/g)||[]).length;
	if (val.length != spots)
		return "";
	
	for (var t = 0, v = 0; t < template.length; t++) {
		if (template.charAt(t) == "x") {
			ret += val.charAt(v);
			v++;
		} else {
			ret += template.charAt(t);
		}
	}
	return ret;
}			


function getRelativeDateFromString(strdate) {
	// Expected format (in UTC): 2012/10/02 21:42:56
	if (0 == strdate.length)
		return getNoDateString();
	
	var thedate = null, thetime = null, parts = strdate.split(" ");
	thedate = parts[0].split("/");
	if (parts.length > 1)
		thetime = parts[1].split(":");
	
	var dt = new Date(), today = new Date();
	dt.setUTCFullYear(parseInt(thedate[0], 10));
	// 2020-01-31: Setting month first has screwy behavior only if the current date does not exist in the month that's set
	//	Fix is to set date, then the month: https://stackoverflow.com/a/30561836
	dt.setUTCDate(parseInt(thedate[2], 10));
	dt.setUTCMonth(parseInt(thedate[1], 10) - 1);
	if (null != thetime) {
		dt.setUTCHours(parseInt(thetime[0], 10));
		dt.setUTCMinutes(parseInt(thetime[1], 10));
		dt.setUTCSeconds(parseInt(thetime[2], 10));
	} else {
		dt.setUTCHours(0);
		dt.setUTCMinutes(0);
		dt.setUTCSeconds(0);
	}
	
	var delta = today - dt;
	var mins = Math.round(delta / 1000 / 60);
	var hours = Math.round(delta / 1000 / 60 / 60);
	var days = Math.round(delta / 1000 / 60 / 60 / 24);
	var months = Math.round(delta / 1000 / 60 / 60 / 24 / 30);	// Using 30 days/month approximation
	var years = Math.round(delta / 1000 / 60 / 60 / 24 / 365);
	
	if (years > 0) {
		ret = getMonthDay(dt);
		ret += " (" + years + " year" + pluralize(years) + " ago)";
	} else if (months > 0) {
		ret = getMonthDay(dt);
		ret += " (" + months + " month" + pluralize(months) + " ago)";
	} else if (days > 0) {
		ret = getMonthDay(dt);
		ret += " (" + days + " day" + pluralize(days) + " ago)";
	} else if (hours > 0) {
		if (dt.getDate() == today.getDate()) {
			ret = getHourSec(dt);
		} else {
			ret = getMonthDay(dt);
		}
		ret += " (" + hours + " hour" + pluralize(hours) + " ago)";
	} else {
		ret = getHourSec(dt);
		ret += " (" + mins + " min" + pluralize(mins) + " ago)";
	}
	return ret;
}


function getMonthDay(dt) {
	var months = new Array();
	months[months.length] = "Jan";
	months[months.length] = "Feb";
	months[months.length] = "Mar";
	months[months.length] = "Apr";
	months[months.length] = "May";
	months[months.length] = "Jun";
	months[months.length] = "Jul";
	months[months.length] = "Aug";
	months[months.length] = "Sep";
	months[months.length] = "Oct";
	months[months.length] = "Nov";
	months[months.length] = "Dec";
	
	return months[dt.getMonth()] + " " + dt.getDate();
}


function getHourSec(dt) {
	var hr = dt.getHours();
	var ampm = " am";
	if (0 == hr) {
		hr = "12";
	} else if (hr >= 12) {
		ampm = " pm";
		if (hr > 12)
			hr = hr % 12;
	}
		
	return hr + ":" + pad(dt.getMinutes(), "0", 2, true) + ampm;
}


// Returns format YYYY/MM/DD of a JS Date object
function getYearMonthDay(dt) {
	return dt.getFullYear() + "/" + pad((dt.getMonth()+1), "0", 2, true) + "/" + pad(dt.getDate(), "0", 2, true);
}

function formatDateTimeFromString(strdate) {
	// Expected format (in UTC): 2012/10/02 21:42:56
	if (0 == strdate.length)
		return getNoDateString();
		
	var thedate = null, thetime = null, parts = strdate.split(" ");
	thedate = parts[0].split("/");
	if (parts.length > 1)
		thetime = parts[1].split(":");
	
	var dt = new Date();
	dt.setUTCFullYear(parseInt(thedate[0], 10));
	// 2020-01-31: Setting month first has screwy behavior only if the current date does not exist in the month that's set
	//	Fix is to set date, then the month: https://stackoverflow.com/a/30561836
	dt.setUTCDate(parseInt(thedate[2], 10));
	dt.setUTCMonth(parseInt(thedate[1], 10) - 1);
	if (null != thetime) {
		dt.setUTCHours(parseInt(thetime[0], 10));
		dt.setUTCMinutes(parseInt(thetime[1], 10));
		dt.setUTCSeconds(parseInt(thetime[2], 10));
		return formatDateTime(dt);
	} else {
		dt.setUTCHours(0);
		dt.setUTCMinutes(0);
		dt.setUTCSeconds(0);
		return formatDate(dt);
	}	
}


// Format: 1:23:45 PM
function formatWesternTime(dt) {
	var a_p = "PM";
	var hr = dt.getHours();
	if (hr < 12) {
		a_p = "AM";
	}
	
	if (0 == hr) {
		hr = 12;
	} else {
		if (hr > 12) {
			hr = hr - 12;
		}
	}
	
	return (hr + ":" + pad(dt.getMinutes(), "0", 2, true) + ":" + pad(dt.getSeconds(), "0", 2, true) + " " + a_p);
}


// Format: MM/DD/YYYY
function formatDateMDY(dt) {
	var ret = (dt.getMonth()+1).toString() + "/" + pad(dt.getDate(), "0", 2, true) + "/" + dt.getFullYear();
	return ret;
}

// Format: DD/MM/YYYY
function formatDateDMY(dt) {
	var ret = pad(dt.getDate(), "0", 2, true) + "/" + (dt.getMonth()+1).toString() + "/" + dt.getFullYear();
	return ret;
}
 
function formatDateTime(dt) {
	// 2015-02-16 - Too long on IE 10: Wednesday, December 17, 2014 4:53:30 PM
	//return dt.toLocaleString();
	
	// The following format can be changed to match the locale
	return (formatDateMDY(dt) + ", " + formatWesternTime(dt));
}

	
function formatDate(dt) {
	return getDayOfWeek(dt.getUTCDay()) + ", " + getMonthByInt(dt.getUTCMonth()+1) + " " + dt.getUTCDate() + ", " + dt.getUTCFullYear();
}


function formatDate2(objDate, bAsLocal, bInclWeekDay, bInclTime) {
	var ret = "";
	
	var months = new Array();
	months[months.length] = "Jan";
	months[months.length] = "Feb";
	months[months.length] = "Mar";
	months[months.length] = "Apr";
	months[months.length] = "May";
	months[months.length] = "Jun";
	months[months.length] = "Jul";
	months[months.length] = "Aug";
	months[months.length] = "Sep";
	months[months.length] = "Oct";
	months[months.length] = "Nov";
	months[months.length] = "Dec";
	
	var days = new Array();
	days[days.length] = "Sun";
	days[days.length] = "Mon";
	days[days.length] = "Tue";
	days[days.length] = "Wed";
	days[days.length] = "Thu";
	days[days.length] = "Fri";
	days[days.length] = "Sat";


	if (bInclWeekDay)
		ret = ret + days[objDate.getDay()] + ", ";
	ret = ret + objDate.getDate() + "-" + months[objDate.getMonth()] + "-" + objDate.getFullYear();
	if (bInclTime) {
		if (bAsLocal) {
			ret = ret + " " + objDate.getHours() + ":" + pad(objDate.getMinutes(), "0", 2, true) + ":" + pad(objDate.getSeconds(), "0", 2, true);
		} else {
			ret = ret + " " + objDate.getUTCHours() + ":" + pad(objDate.getUTCMinutes(), "0", 2, true) + ":" + pad(objDate.getUTCSeconds(), "0", 2, true) + " UTC";
		}
	}
	
	return ret;
}


function formatDateTimeStringDashboard(strTime, bAsLocal, bInclWeekDay) {
	var objDate = new Date(strTime + " UTC");
	return formatDateTimeDashboard(objDate, bAsLocal, bInclWeekDay);
}


function formatDateTimeDashboard(objDate, bAsLocal, bInclWeekDay) {
	var ret = "";
	
	var months = new Array();
	months[months.length] = "Jan";
	months[months.length] = "Feb";
	months[months.length] = "Mar";
	months[months.length] = "Apr";
	months[months.length] = "May";
	months[months.length] = "Jun";
	months[months.length] = "Jul";
	months[months.length] = "Aug";
	months[months.length] = "Sep";
	months[months.length] = "Oct";
	months[months.length] = "Nov";
	months[months.length] = "Dec";
	
	var days = new Array();
	days[days.length] = "Sun";
	days[days.length] = "Mon";
	days[days.length] = "Tue";
	days[days.length] = "Wed";
	days[days.length] = "Thu";
	days[days.length] = "Fri";
	days[days.length] = "Sat";

	//if (bAsLocal) {
		/* toLocaleString() varies too much by browser
		var loc = objDate.toLocaleString();
		if (!bInclWeekDay) {
			var pos = loc.indexOf(" ");
			if (pos >= 0)
				loc = loc.substring(pos + 1, loc.length);
		}
		// Chrome adds TZ info at end
		var pos = loc.indexOf(" GMT");
		if (pos >= 0)
			loc = loc.substring(0, pos);
		ret = loc;*/
	//} else {
		if (bInclWeekDay)
			ret = ret + days[objDate.getUTCDay()] + ", ";
		ret = ret + objDate.getUTCDate() + "-" + months[objDate.getUTCMonth()] + "-" + objDate.getUTCFullYear();
		ret = ret + " " + objDate.getUTCHours() + ":" + pad(objDate.getUTCMinutes(), "0", 2, true) + ":" + pad(objDate.getUTCSeconds(), "0", 2, true) + " UTC";
	//}
	
	return ret;
}


function getDaysUntil(strDate) {
	var dtExp = new Date(strDate), dtNow = new Date();
	dtNow.setHours(0);
	dtNow.setMinutes(0);
	dtNow.setSeconds(0);
	var delta = dtExp - dtNow;
	var days = Math.round(delta / 1000 / 60 / 60 / 24);
	return days;
}


function getDayOfWeek(dow) {
	switch (dow) {
		case 0: return "Sunday";
		case 1: return "Monday";
		case 2: return "Tuesday";
		case 3: return "Wednesday";
		case 4: return "Thursday";
		case 5: return "Friday";
		case 6: return "Saturday";
		default: return "Unexpected day of week number: " + dow;
	}
}


// Do NOT pass Date.getMonth() directly to this as it goes 0-11!
function getMonthByInt(mon) {
	switch (mon) {
		case 1: return "January";
		case 2: return "February";
		case 3: return "March";
		case 4: return "April";
		case 5: return "May";
		case 6: return "June";
		case 7: return "July";
		case 8: return "August";
		case 9: return "September";
		case 10: return "October";
		case 11: return "November";
		case 12: return "December";
		default: return "Unexpected month number: " + mon;
	}
}


function formatOTP(otp) {
	var ret = "";
	if (otp.length > 4) {	// Add spaces so it's easier to read if it's 5 chars or longer
		var pos = 0;
		while (pos < otp.length) {
			ret += otp.substr(pos, 3) + " ";
			pos += 3;
		}
	} else {
		ret += otp;
	}
	return ret;
}


function hasVScroll() {
	//alert("document.body.scrollHeight: " + document.body.scrollHeight + "\ndocument.body.clientHeight: " + document.body.clientHeight + "\ndocument.documentElement.clientHeight: " + document.documentElement.clientHeight);
	// 2013-01-02 - PG Desktop window can't be resized...
	if (g_bPGClient)
		return false;
	
	try {
		return document.body.scrollHeight > document.documentElement.clientHeight;
	} catch(e) {
		return true;
	}
}

function getTotalDocHeight(){
	var ret = 0;
	var d = document.documentElement;
	var b = document.body;
	var who = d.offsetHeight ? d : b;
	if (isChromeBrowser()) {
		ret = Math.max(who.clientHeight, who.offsetHeight);
	} else {
		ret = Math.max(who.scrollHeight, who.offsetHeight);
	}
	//alert("getTotalDocHeight: " + ret);
	return ret;
}

function f_clientWidth() {
	return f_filterResults (
		window.innerWidth ? window.innerWidth : 0,
		document.documentElement ? document.documentElement.clientWidth : 0,
		document.body ? document.body.clientWidth : 0
	);
}
function f_clientHeight() {
	return f_filterResults (
		window.innerHeight ? window.innerHeight : 0,
		document.documentElement ? document.documentElement.clientHeight : 0,
		document.body ? document.body.clientHeight : 0
	);
}
function f_scrollLeft() {
	return f_filterResults (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}
function f_scrollTop() {
	return f_filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}
function f_filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

function stretchBlockingDiv() {
	// 2013-01-02 - Set height of blocking div (for scrollable window)
	if (hasVScroll()) {
		document.getElementById("blockUI").style.height = "100%";
	} else {
		document.getElementById("blockUI").style.height = "100%";
	}
}

function dedupeArray(arr) {
    var i, len = arr.length, out = [], obj = {};
    for (i = 0; i < len; i++)
        obj[arr[i]] = 0;
    for (i in obj)
        out.push(i);
    return out;
}

function removeFromArray(arr, val) {
    for (var i = arr.length - 1; i >= 0; i--)
        if (arr[i] === val)
            arr.splice(i, 1);
    return arr;
}

/*function changeQptQLabels() {
	try {
		// 2017-02-20 - Only need to change field labels if they're using drop-down question format
		if (bDDQuestions) {
			for (var i = 1; i <= MAX_OPT_QS; i++) {
				var theid = "lblOptQ" + i;
				document.getElementById(theid).htmlFor = "OQ" + i;	// Yes, unexpected attribute name since 'for' is a JS keyword
			}
		}
	} catch(e) { console.log("changeQptQLabels() exception: " + e); }
}*/

/* Cross-tab Logout */
function handleCrossTabLogout() {
    var xhr = false;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    try {
        xhr.open("GET", "/ttl.ashx", true);
        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
            xhr.onload = function (event) { if (0 != xhr.responseText.indexOf("<ttl>")) { window.top.location.reload(true); } }
        } else {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) { if (0 != xhr.responseText.indexOf("<ttl>")) { window.top.location.reload(true); } }
            }
        }
        xhr.send(null);
    } catch (e) {
    }
}


/* 2018-02-15 - Lanyard login */
var g_LanyardLogin = false, g_QRCode = null, g_AnimFrameID;
function showLanyardLoginButton(bShow) { setElemVisibility(["divLanyardLoginButton"], bShow); }

function drawLine(elem, begin, end, color) {
	elem.beginPath();
	elem.moveTo(begin.x, begin.y);
	elem.lineTo(end.x, end.y);
	elem.lineWidth = 4;
	elem.strokeStyle = color;
	elem.stroke();
}

function drawTrapezoid(code, elem, color) {
	drawLine(elem, code.location.topLeftCorner, code.location.topRightCorner, color);
	drawLine(elem, code.location.topRightCorner, code.location.bottomRightCorner, color);
	drawLine(elem, code.location.bottomRightCorner, code.location.bottomLeftCorner, color);
	drawLine(elem, code.location.bottomLeftCorner, code.location.topLeftCorner, color);
}

function getLineLength(x1, y1, x2, y2) {
	var dx = Math.abs(x2 - x1);
	var dy = Math.abs(y2 - y1);
	var sq = Math.pow(dx, 2) + Math.pow(dy, 2);
	var rt = Math.sqrt(sq);
	return rt;
}

function areValidCoords(obj, maxW, maxH) {
	// First check - coords must be within visible UI
	if (obj.topLeftCorner.x > 0 && obj.topLeftCorner.x <= maxW && obj.topLeftCorner.y > 0 && obj.topLeftCorner.y <= maxH &&
		obj.topRightCorner.x > 0 && obj.topRightCorner.x <= maxW && obj.topRightCorner.y > 0 && obj.topRightCorner.y <= maxH &&
		obj.bottomRightCorner.x > 0 && obj.bottomRightCorner.x <= maxW && obj.bottomRightCorner.y > 0 && obj.bottomRightCorner.y <= maxH &&
		obj.bottomLeftCorner.x > 0 && obj.bottomLeftCorner.x <= maxW && obj.bottomLeftCorner.y > 0 && obj.bottomLeftCorner.y <= maxH) 
	{
		// Second check, all 4 edges must be with a certain percent of one another
		//	This prevents mis-reads where the trapezoid is really narrow (which occurs when no QR is shown)
		var edgeTop = getLineLength(obj.topLeftCorner.x, obj.topLeftCorner.y, obj.topRightCorner.x, obj.topRightCorner.y);
		var edgeRight = getLineLength(obj.topRightCorner.x, obj.topRightCorner.y, obj.bottomRightCorner.x, obj.bottomRightCorner.y);
		var edgeBot = getLineLength(obj.bottomRightCorner.x, obj.bottomRightCorner.y, obj.bottomLeftCorner.x, obj.bottomLeftCorner.y);
		var edgeLeft = getLineLength(obj.bottomLeftCorner.x, obj.bottomLeftCorner.y, obj.topLeftCorner.x, obj.topLeftCorner.y);
		
		//console.log("top: " + edgeTop + ", right: " + edgeRight + ", bottom: " + edgeBot + ", left: " + edgeLeft);
		
		var themax = Math.max(edgeTop, edgeRight, edgeBot, edgeLeft);
		var themin = Math.min(edgeTop, edgeRight, edgeBot, edgeLeft);
		var diff = themax - themin;
		var pcent = (diff / themax);
		if (pcent > .20) {
			//console.log("Difference (" + diff + ") between extreme edges [" + themax + ", " + themin + "] is too large: " + pcent);
		} else {		
			return true;
		}
	}
	return false;
}

function isValidPGCode(qr) {
	if (3 == strCount(qr, ":"))
		return true;
	return false;
}

function isLanyardLogin() { return g_LanyardLogin; }

// 0 == name/pw, 1 = lanyard
function rememberLoginType(thetype) {
    if (g_bShowRememberLoginType) {
        if (frmMainLogon.elements["RememberLoginType"].checked) {
            var user = frmMainLogon.elements[FLD_DSP_USER].value;
            var expires = new Date();
            var MINS_TO_REMEMBER = 15;  /* Change this value to control how long the login type is saved across browser logouts & restarts */
            expires.setTime(expires.getTime() + MINS_TO_REMEMBER * 60 * 1000);
            setCookie(PG_COOKIE_LOGINTYPE, thetype, expires, "/");
        } else {
            deleteCookie(PG_COOKIE_LOGINTYPE, "/");
        }
    }
}

function useRememberedLoginType() {
    if (g_bShowRememberLoginType) {
        var thetype = getCookie(PG_COOKIE_LOGINTYPE);
        if (thetype && thetype.length > 0) {
            frmMainLogon.elements["RememberLoginType"].checked = true;
            if (0 == thetype) {
                showNamePWLogin();
            } else if (1 == thetype) {
                showLanyardLogin();
            }
        }
    }
}

function BKMobilePushHandler(bInitiate, frm, rootXML) {
	g_bBKMobilePushAttempted = bInitiate;
	GenericPushHandler(bInitiate, frm, rootXML, "bkmpush");
}

function DuoPushHandler(bInitiate, frm, rootXML) {
	g_bDuoPushAttempted = bInitiate;
	GenericPushHandler(bInitiate, frm, rootXML, "duopush");
}

function AuthyPushHandler(bInitiate, frm, rootXML) {
	g_bAuthyPushAttempted = bInitiate;
	GenericPushHandler(bInitiate, frm, rootXML, "authypush");
}

function GenericPushHandler(bInitiate, frm, rootXML, pushotpval) {
	try {		
		setElemVisibility(["fldsOTPEntryOTP", "SSOTPEntry", "fldsSetPWOTP"], !bInitiate);
		if (!bInitiate) {
			// This div is HIDDEN by default so restore it to hidden
			setElemVisibility(["SSOTPEntry"], false);
		}
		
		var otpval = (bInitiate ? pushotpval : "");
		// 2018-05-23 - Keep the duo flag in the OTP field for multi-step actions!
		//	Check the response XML to see if the push succeeded
		if (!bInitiate && null != rootXML) {
			if (PG_AUTHTYPE_SETPW == AUTHTYPE) {
				var pwauth_root = getXMLChildElement(rootXML, "pwauth");
				if (pwauth_root) {
					var otp_root = getXMLChildElement(pwauth_root, "otp");
					if (otp_root && 1 == getXMLAttrNum(otp_root, "verified"))
						otpval = pushotpval;
				}
			} else if (PG_AUTHTYPE_SS == AUTHTYPE) {
				// SSPR gives different XML than PW change!
				// 2018-05-24: NOTE: There is only a subsequent step for PW Reset, other SSPR actions complete at step 4
				if (getXMLChildElement(rootXML, "pwquality"))
					otpval = pushotpval;
			}
			// No "else" block - we're not doing this for any other actions
		}		
		frm[PG_FLDNAME_OTP].value = otpval;
		
		// 2018-05-21 - Auto-submit to initiate it
		if (bInitiate) {
			switch (AUTHTYPE) {
			case PG_AUTHTYPE_SETPW:
				submitSetPW();
				break;
				
			case PG_AUTHTYPE_SS:
				submitSS();
				break;
			
			case PG_ACCT_CHECKOTP:
				submitMFAOTPEntry();
				break;
				
			case PG_AUTHTYPE_OTPENTRY:
			default:
				submitOTPEntry();
			}
		} else {
			// 2018-06-07 - Restore "remember" checkbox, if it is allowed
			if (PG_AUTHTYPE_OTPENTRY == AUTHTYPE && g_bRememberAvailable) {
				setElemVisibility(["spnSaveUA2FA"], true);
			}
		}
	} catch (e) {
		console.log(formatException("GenericPushHandler()", e));
	}
}


function clearOTPInstructions() {
	switch (AUTHTYPE) {
		case PG_AUTHTYPE_SETPW:		setElemContent("", ["infoSetPW"]); break;
		case PG_AUTHTYPE_SS: 		setElemContent("", ["infoSS"]); break;
		case PG_AUTHTYPE_OTPENTRY: 	setElemContent("", ["infoOTPEntry"]); break;
	}
}


// 2018-11-20 - Smart card login
function doSmartCardLogin(scard_server) {
	// Protocol already has the colon
	var pgurl = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
	// Get target URL
	var path = getQSVar("ReturnUrl");
	if (0 == path.length)
		path = "/default.aspx";
	// Always need to have the PG server name as well, can't be partial URLs
	pgurl += path;
	var redir_url = scard_server + "/default.aspx?ReturnUrl=" + encodeURIComponent(pgurl);
	
	// Redirect to smartcard enabled site with this as the ReturnUrl
	window.location = redir_url;
}

function isHTTPSConnection() { return location.protocol == 'https:'; }


var g_bFrom2FAGroup = false;
var g_Saved2FARoot = null, g_SavedRoot = null;
var g_2FAGroupEnrolledPhone = g_2FAGroupEnrolledEmail = g_2FAGroupEnrolledMobile = 0, g_2FAGroupEnrolledBKMPalm = 0;	// 0=not grouped, 1=grouped but not enrolled, 2=grouped and enrolled
var PG_FLDNAME_2FAGROUPCHOICE = "2FAGrpChoice";

function shouldDisplay2FAGroupChooser(root_group, root) {
	// Bail if the element isn't present
	if (null == root_group)
		return false;
	return true;
}	
	
function create2FAGroupChooser(root_group, root) {
	setElemContent(get2FAEnrollmentTitle(0), ["2FAGrpTitle"]);	// Passing 0 uses the default text return value 
	var numreq = getXMLAttrNum(root_group, "req");
	var total = root_group.childNodes.length;
	var enrolled = 0;	// How many they've already completed
	
	// Keep these around for spawning the appropriate enrollment dialog
	g_SavedRoot = root;
	g_Saved2FARoot = root_group;

	// Parse out the types that aren't yet enrolled
	var inner = "";
	for (var i = 0; i < root_group.childNodes.length; i++) {
		var child = root_group.childNodes[i];
		var bCompleted = ("0" == child.textContent ? false : true);
		if (bCompleted) enrolled++;
		var theclass = (bCompleted ? "lblRadioDisabled" : "lblRadio");
		if ("phone" == child.nodeName) {
			inner += "<input type='radio' id='radio2FAGrpPhone' name='" + PG_FLDNAME_2FAGROUPCHOICE + "' value='phone'" + (bCompleted ? " disabled" : "") + ">";
			inner += "<label class='" + theclass + "' for='radio2FAGrpPhone'>" + getOTPDeliveryDesc(AUTHTYPE_2FA_METHOD_PHONE) + (bCompleted ? get2FAGroupCompleted() : "") + "</label><br>";
			g_2FAGroupEnrolledPhone = (bCompleted ? 2 : 1);
		} else if ("email" == child.nodeName) {
			inner += "<input type='radio' id='radio2FAGrpEmail' name='" + PG_FLDNAME_2FAGROUPCHOICE + "' value='email'" + (bCompleted ? " disabled" : "") + ">";
			inner += "<label class='" + theclass + "' for='radio2FAGrpEmail'>" + getOTPDeliveryDesc(AUTHTYPE_2FA_METHOD_EMAIL) + (bCompleted ? get2FAGroupCompleted() : "") + "</label><br>";
			g_2FAGroupEnrolledEmail = (bCompleted ? 2 : 1);
		} else if ("mobile" == child.nodeName) {
			inner += "<input type='radio' id='radio2FAGrpMobile' name='" + PG_FLDNAME_2FAGROUPCHOICE + "' value='mobile'" + (bCompleted ? " disabled" : "") + ">";
			inner += "<label class='" + theclass + "' for='radio2FAGrpMobile'>" + getOTPDeliveryDesc(AUTHTYPE_2FA_METHOD_MOBILE) + (bCompleted ? get2FAGroupCompleted() : "") + "</label><br>";
			g_2FAGroupEnrolledMobile = (bCompleted ? 2 : 1);
		} else if ("bkm-palm" == child.nodeName) {
			inner += "<input type='radio' id='radio2FAGrpBKMPalm' name='" + PG_FLDNAME_2FAGROUPCHOICE + "' value='bkm-palm'" + (bCompleted ? " disabled" : "") + ">";
			inner += "<label class='" + theclass + "' for='radio2FAGrpBKMPalm'>" + getOTPDeliveryDesc(AUTHTYPE_2FA_METHOD_BKMOBILE_PALM) + (bCompleted ? get2FAGroupCompleted() : "") + "</label><br>";
			g_2FAGroupEnrolledBKMPalm = (bCompleted ? 2 : 1);
		} else {
			console.log("create2FAGroupChooser(): Unexpected grouped enrollment type: " + child.nodeName);
		}
	}
	
	setElemContent(getUsernameLabel(), ["lblUName2FAGrp"]);
	setElemContent(get2FAGroupEnrollInstr(numreq, total, enrolled), ["info2FAGrp"]);
	setElemContent(getBtnContinue(), ["btn2FAGrpContinue"]);
	setElemContent(getBtnCancel(), ["btn2FAGrpCancel"]);

	if (inner.length > 0) {
		setElemContent(inner, ["div2FAGrpTypes"]);
		var rbtns = document.getElementsByName(PG_FLDNAME_2FAGROUPCHOICE);
		for (var i = 0; i < rbtns.length; i++) {
			if (!rbtns[i].disabled) {
				rbtns[i].checked = true;
				rbtns[i].focus();
				break;
			}
		}
	}

	document.getElementById("Username2FAGrp").value = frmMainLogon.elements[FLD_SUBMIT_USER].value;
	closeAllPopups();
	doPopup("popup_2FAGrp");

	setAuthType(PG_AUTHTYPE_GROUP2FAENROLL);	// Just for submitting from Enter key
}

function submit2FAGroup() {
	try {
		// 2019-12-02 - This checkbox *must* be enabled for initial enrollment, regardless of display state
		document.getElementById("MakeMFADefaultOTPEntry").checked = document.getElementById("MakeMFADefaultMobileApp").checked = document.getElementById("MakeMFADefaultBKMobile").checked = true;
		setElemVisibility(["fldsOTPEntryDefMethod", "fldsMobileAppDefMethod", "fldsBKMobileDefMethod"], false);	// 2019-12-02 - Do NOT show for initial enrollment

		// Do we need to display the "make default OTP" checkbox -OR- change its state?
		if (1 == getXMLAttrNum(g_Saved2FARoot, "showdef")) {
			setElemContent(getMakeDefaultOTPMethodLabel(), ["lblMakeMFADefaultOTPEntry", "lblMakeMFADefaultMobileApp", "lblMakeMFADefaultBKMobile"]);
			
			if (2 == g_2FAGroupEnrolledPhone || 2 == g_2FAGroupEnrolledEmail || 2 == g_2FAGroupEnrolledMobile || 2 == g_2FAGroupEnrolledBKMPalm) {
				document.getElementById("MakeMFADefaultOTPEntry").checked = document.getElementById("MakeMFADefaultMobileApp").checked = document.getElementById("MakeMFADefaultBKMobile").checked = false;
				setElemVisibility(["fldsOTPEntryDefMethod", "fldsMobileAppDefMethod", "fldsBKMobileDefMethod"], true);	// 2019-12-02 - Only show for "secondary" enrollments
			}
		}

		// Show the appropriate popup! What value did they choose?
		var sel = document.querySelector("input[name='" + PG_FLDNAME_2FAGROUPCHOICE + "']:checked").value;
		if ("phone" == sel) {
			document.getElementById("OTPEnrollType").value = document.getElementById("OTPEntryType").value = AUTHTYPE_2FA_METHOD_PHONE;
			showOTPEnroll();
		} else if ("email" == sel) {
			document.getElementById("OTPEnrollType").value = document.getElementById("OTPEntryType").value = AUTHTYPE_2FA_METHOD_EMAIL;
			showOTPEnroll();
		} else if ("mobile" == sel) {
			showMobileAppPopup(g_SavedRoot);

			// To enable a Cancel button on the Mobile App enroll dialog
			setElemVisibility(["spanMobileAppSkipBtn"], true);
			var btn = document.getElementById("btnMobileAppSkip");
			setElemContent(getBtnCancel(), ["btnMobileAppSkip"]);	// Button usually says "Skip", we're not reverting this back since mobile enrollment should only occur through this new feature for this session (changing of username is unlikely)
			btn.onclick = function() { closeMobileApp(false); return false; }	// Returning false ensures this button doesn't perform a submit action
		} else if ("bkm-palm" == sel) {
			showBKMobilePopup(g_SavedRoot);
		} else {
			console.log("submit2FAGroup(): Unexpected value choice '" + sel + "' for " + PG_FLDNAME_2FAGROUPCHOICE);
		}
		
		clean2FAGroup();
	} catch (e) {
		console.log(formatException("submit2FAGroup()", e));
	}
}

function clean2FAGroup() {
	setElemContent("", ["div2FAGrpTypes"]);
	
	// Wipe out the global XML object, reset the global settings
	g_Saved2FARoot = g_SavedRoot = null;
	g_2FAGroupEnrolledPhone = g_2FAGroupEnrolledEmail = g_2FAGroupEnrolledMobile = g_2FAGroupEnrolledBKMPalm = 0;
}

function close2FAGroup(cancel) {
	closePopup("popup_2FAGrp");
}


function submitNetAUP() {
	if (null != frmWifiAuth) {
		try {
			// POST to new PG page
			document.getElementById("AcceptNetAUP").value = "1";	// An acceptance
			
			// Response on success will be an auto-submitting form with all required fields for WLAN login
			frmWifiAuth.submit();
			return;
		} catch (e) {
			console.log(formatException("submitNetAUP(): Error submitting WLC form", e));
		}
	}
}

function closeNetAUP() {
	// Just close the popup, don't log rejections
	closePopup("popup_NetAUP");
}


function cancelAsyncOp() {
	try {
		if (g_objAsyncCtrl) {
			g_objAsyncCtrl.cancel(arguments[0]);	// 2021-04-17 - Will be undefined most of the time! See note in object's cancel func below
			delete g_objAsyncCtrl; 
			g_objAsyncCtrl = null; 
		}
		// 2021-05-07 - Only call this function if it's been defined!
		if (typeof funcCancelXHR !== 'undefined') {
			funcCancelXHR();
			// Can't delete a func in JS so make subsequent calls do nothing (until set in doWSPAuth...)
			funcCancelXHR = function() {};
		}
	} catch (ex) {
		console.log("cancelAsyncOp(): Caught exception - " + ex);
	}
	return false;
}
	
function PG_AsyncController(_id, _theform, _thediv) {
	this.txid = _id;
	this.frm = _theform;
	this.thediv = _thediv;
	this.attempts = 0;
	this.interval = null;
	this.delay = 2000;	// In millis
	this.maxTries = 5;
	
	this.getAttempts = function() { return this.attempts; };
	this.getMaxAttempts = function() { return this.maxTries; };
	this.getTXID = function() { return this.txid; };
	this.getDelay = function() { return this.delay; };
	this.isRetry = function() { return (this.attempts > 0); };
	this.tryAgain = function(func) {
		try {
			this.attempts++;
			if (this.attempts <= this.maxTries) {
				var to = setTimeout(func, this.getDelay());
				this.saveHandler(to);	// So the user can cancel the operation
				return this.attempts;
			}
		} catch (ex) {
			console.log("PG_AsyncController::tryAgain() exception - " + ex);
		}
		return 0;	// Cancel
	};
	this.saveHandler = function(to) { this.interval = to; };
	this.customCancel = function() {};	// Nothing by default
	this.cancel = function() {
		try {
			// 1) Stop actions
			clearTimeout(this.interval);
			this.interval = null;
			
			// 2) Clean up the UI
			setElemContentDirect("", this.thediv);
			toggleInputFields(this.frm, false);
			
			// 3) Ability to have a custom cancel, do this inline synchronously so it doesn't overwrite msg from the main loop
			// 2021-04-17 - Adding optional arguments for maintaining state across actions (PW reset) that have a step AFTER BKMpush
			this.customCancel(arguments[0]);	// This will be undefined most of the time
			
			// 2021-09-03 - Unfortunately the above function hides the 'Problems with OTP' link for SSPR. Does not affect the link while logging in.
			if (this.frm.id == 'SSForm'){
				setElemVisibility(["SSOTPEntry"], true);
				setElemVisibility(["fldSSOTP"], false);				
			}
			
			// 4) Finally, clean internal state
			this.txid = "";
			this.frm = null;
			this.thediv = null;
			this.attempts = 0;		
			this.customCancel = function() {};
		} catch (ex) {
			console.log("PG_AsyncController::cancel() exception - " + ex);
		}
	}
}

// 2020-04-24 - Moved here from extension-specific JS files

/*
 * COMMON/UTILITY FUNCTIONS
 */
function doAJAXGET(URL, thediv, proc) { return doAJAX(false, URL, null, thediv, proc); }
function doAJAXPOST(URL, frm, thediv, proc, extra) { return doAJAX(true, URL, frm, thediv, proc, extra); }
function doAJAX(bIsPOST, URL, frm, thediv, proc, extra) {

    // 2017-03-30 - NOTE: These are typically background requests that are NOT initiated by end-user actions so do NOT prevent "resubmits"!
    //  This is why we're not doing anything with g_bNoSubmit

    var xmlHttpReq = false;
    var bSent = false;
    g_TargetDiv = thediv;

    if (window.XMLHttpRequest) {
        xmlHttpReq = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }

    try {
        // 2017-03-20 - Only supporting GET or POST at the moment
        xmlHttpReq.open((bIsPOST ? "POST" : "GET"), URL, true);

        // 2014-09-11 - Special handling for iOS to prevent multiple callbacks
        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
            xmlHttpReq.onload = function (event) {
                eval(proc + "(frm, xmlHttpReq.responseText, thediv);");
            }
        } else {
            xmlHttpReq.onreadystatechange = function () {
                if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
                    eval(proc + "(frm, xmlHttpReq.responseText, thediv);");
                }
            }
        }

        var postdata = "";
        if (bIsPOST) {
            xmlHttpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            postdata = addPOSTFields(frm);
			if (typeof extra === 'undefined') {
				// Nothing extra to add
			} else {
				postdata += extra;
			}
        }

        xmlHttpReq.send(postdata);
        bSent = true;
    } catch (e) {
        console.log(formatException("doAJAX()", e));
    }

    // 2010-02-01 - Only do if successfully POSTed the data (otherwise UI appears hanged)
    if (bSent) {
        if (null != frm) {
            clearFieldClasses(frm);
            toggleInputFields(frm, true);
        }
        setElemContentDirect("", thediv);	// 2020-04-24 - Normalized this behavior between extensions & WEB-key
    }
}

function commonXMLProcesing(frm, strResp, root_name) {
    toggleInputFields(frm, false);

    // Reset this to allow other requests
    g_bNoSubmit = false;

    if (strResp != "") {
        try {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(strResp, "text/xml");
        } catch (e) {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(strResp);
        }

        return getXMLChildElement(xmlDoc, root_name);
    } else {
        alert("commonXMLProcesing(): Blank XML response");
    }

    return null;
}

function htmlEncode(value) { return $('<div/>').text(value).html(); }
function htmlDecode(value) { return $('<div/>').html(value).text(); }

function setOption(el, value) {
    for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].value == value) { el.selectedIndex = i; return; }
    }
}

function addHiddenInput(frm, fldnm, fldval) {
    if (null == frm || 0 == fldnm.length)
        return;

    if (null == frm.elements[fldnm]) {
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", fldnm);
        frm.appendChild(input);
    }

    frm.elements[fldnm].value = fldval;    
}

function generateRandomString(length) {
	var result = '';
	var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var CHARSLEN = CHARS.length;
	for (var i = 0; i < length; i++) {
		result += CHARS.charAt(Math.floor(Math.random() * CHARSLEN));
	}
	return result;
}

function sha1Hash(inp) {
	try {
		var res = sha1.create();
		res.update(inp);
		return res.hex().toUpperCase();
	} catch (e) {
		console.log(formatException("sha1Hash()", e));
	}
	return "";
}

function isAndroidDevice() {
	var ua = navigator.userAgent.toLowerCase();
	return (ua.indexOf("android") > -1); //&& ua.indexOf("mobile");
}

function isiOSDevice() {
	// From: https://stackoverflow.com/a/9039885/1733114
	var bRet = [ 'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod' ].includes(navigator.platform) ||
		(navigator.userAgent.includes("Mac") && "ontouchend" in document);  // iPad on iOS 13 detection
	return bRet;  
}

function resumeiOSOperation(evt) {
	// 2021-04-27 - To handle iOS AJAX calls erroring with "network connection was lost" during app switching
	g_bNoSubmit = false;
	if (g_objAsyncCtrl) {
		if (PG_AUTHTYPE_BKMOBILE_ENROLL == AUTHTYPE) {
			submitBKMobileEnable();
		} else if (PG_AUTHTYPE_OTPENTRY == AUTHTYPE) {
			submitOTPEntry();
		} else if (223 == AUTHTYPE) { /* 2021-04-29 - Can't use PG_AUTHTYPE_ACCT_BKMOBILE_PALM here since it's in pg_acct.js which isn't always loaded... */
			submitBKMobileEnroll();
		}
	}
}