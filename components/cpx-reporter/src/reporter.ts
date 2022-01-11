export class ReporterEvent extends Event {
    constructor(name, data?) {
        super('cpx-report', { bubbles:true, composed:true });
        this.name = name;
        this.data = data;
    }
    data?:any;
    name:string;
    toJSON = () => Object.assign({ event: this.name },this.data);
}

/* OLD BROWSER COMPATIBLE 
const scripts = document.getElementsByTagName('script');
const reporter = scripts[scripts.length-1];
*/
const reporter = document.querySelector(`script[src='${(new URL(import.meta.url)).pathname}']`);
if (reporter instanceof HTMLElement) {
    const data = JSON.parse(reporter.textContent ? reporter.textContent : '');
    globalThis.dispatchEvent(new ReporterEvent(reporter.dataset.event,data));
}


/* Reporter Beats */
    
    /*

    Event Types: 
        Page, User, Content, 
        Search, Campaign, Video,
        CTA, Download, Form

    Page Load Completed
     'event': 'Page Load Completed'

    
    Page Load Started
     'event': 'Page Load Started',
    "page": {
        "pageCategory": "technologies",
        "pageName": "<pageName>",
        "pageTitle": "Red Hat Enterprise Linux operating system",
        "analyticsTitle": "<Drupal analyticsTitle field>",        
        "pageType": "pattern_template",
        "pageSubType": "Product",
        "siteExperience": "mobile",
        "siteLanguage": "<siteLanguage>",
        "subsection": "linux-platforms",
        "subsection2": "enterprise-linux2",
        "subsection3": "try-it",
        "cms": "RH CMS 2020.14.0",
        "analyticsTitle": "<Analytics Title field in Drupal>",
        "blogAuthor": "<captures author of blog articles>",
        "contentID": "545121",
        "contentType": "E-book",
        "destinationURL": "https://www.redhat.com/en/home-page",
        "errorType": "404",
        "gated": true,
        "taxonomyMetaHreflang": ["29051"],
        "taxonomyRegion": ["4521"],
        "taxonomyBlogPostCategory": ["4261"],
        "taxonomyBusinessChallenge":["161"],
        "taxonomyProduct":["781"],
        "taxonomyProductLine":["831"],
        "taxonomySolution":["1071"],
        "taxonomyTopic":["9011", "27061"],
        "taxonomyAuthor":["1111"],
        "taxonomyStage":["111"], 
        "dataObject":"digitalData"
        }


    User Signed In
    "event": "User Signed In",
    "user": {
        "custKey": "<custKey>"
    }

    User Detected
     'event': 'User Detected',
    "user": {
        "custKey": "<custKey>",
        "accountID": "<accountID>", //Customer Portal
        "accountIDType": "External",
        "userID": "<userID>",
        "lastLoginDate": "",
        "loggedIn": "false",
        "registered":"true",
        "socialAccountsLinked":"",
        "subscriptionFrequency": "",
        "subscriptionLevel": "",
        "hashedEmail": ""
    }


    Content Listing Displayed
     'event': 'Content Listing Displayed',
    "listingDisplayed": {
        "displayCount": "<displayCount>",
        "listingDriver": "<listingDriver>", 
        "filterList": "<filterList>",
        "resultsCount": "<resultsCount>"
    }

    Content Listing Item Clicked
    'event': 'Content Listing Item Clicked',
    "listingClicked": {
            "displayPosition": "<displayPosition>", 
  	"linkType": "<linkType>", 
  	"contentTitle": "<contentTitle>"
                }


    Onsite Search Performed
     "event": "Onsite Search Performed",
  "onsiteSearch": {
    "keyword": {
      "searchType": "global_search",
      "searchTerm": "<searchTerm>",
      “searchMethod”: “<searchMethod>”
    }
  }

    Internal Campaign Clicked
     'event': 'Internal Campaign Clicked',
    "internalCampaign": {
        "campaignList": [
            {
                "internalCampaignCreative": "<internalCampaignCreative>",
                "internalCampaignID": "<internalCampaignID>",
                "internalCampaignName": "<internalCampaignName>",
                "internalCampaignObjective": "<internalCampaignObjective>",
                "internalCampaignPosition": "<internalCampaignPosition>"
            }
        ],
        "internalCampaignID": "<internalCampaignID>"
    }

    Internal Campaign Displayed
     'event': 'Internal Campaigns Displayed',
    "internalCampaign": {
        "campaignList": [
            {
                "internalCampaignCreative": "<internalCampaignCreative>",
                "internalCampaignID": "<internalCampaignID>",
                "internalCampaignName": "<internalCampaignName>",
                "internalCampaignObjective": "<internalCampaignObjective>",
                "internalCampaignPosition": "<internalCampaignPosition>"
            }
        ]
    }

    Video Started
     "event": "Video Started",
  "video": {
    "videoID": "<videoID>",
    "videoName": "<videoName>",
    "secondsLength": "<secondsLength>",
    "videoPlayerType": "<videoPlayerType>",
    "categoryName": "<categoryName>"
  }


  Video Milestone Reached
  "event": "Video Milestone Reached",
  "video": {
    "milestone": "<milestone>",
    "videoID": "<videoID>",
    "videoName": "<videoName>",
    "secondsLength": "<secondsLength>",
    "videoPlayerType": "<videoPlayerType>",
    "categoryName": "<categoryName>"
  }

  Video Completed
   "event": "Video Completed",
  "video": {
    "categoryName": "<categoryName>",
    "videoPlayerType": "<videoPlayerType>",
    "secondsLength": "<secondsLength>",
    "videoName": "<videoName>",
    "videoID": "<videoID>"
  }



    CTA Link Clicked
    "event": "CTA Link Clicked",
  "linkInfo": {
    "linkId": "<linkId>",
    "linkContainer": "<linkContainer>",
    "linkRegion": "<linkRegion>"
  }

    Download Complete
    "event": "Download Complete",
  "linkInfo": {
    "linkId": "<linkId>",
    "linkContainer": "<linkContainer>",
    "linkRegion": "<linkRegion>",
    "fileName": "<fileName>",
    "fileType": "<fileType>"
  }



    Form Viewed
     'event': 'Form Viewed',
    "form": {
        "formField": [
            {
                "fieldID": "<fieldID>",
                "fieldPosition": "<fieldPosition>"
            }
        ],
        "formID": "<formID>",
        "formName": "<formName>",
        "formType": "<formType>",
        "formTemplate": "<formTemplate>",
        "offerID": "<offerID>",
        "formField": [
          {
            "fieldID": "<fieldID>",
            "fieldPosition": "<fieldPosition>"
          }
        ]
    }


    Form Submission Success
      'event': 'Form Submission Succeeded',
    "form": {
        "formID": "<formID>",
        "formName": "<formName>",
        "formType": "<formType>",
        "formTemplate": "<formTemplate>",
        "offerID": "<offerID>"
    }


    Form Submission Failed    
     'event': 'Form Submission Failed',
    "form": {
        "formError": "<formError>",
        "formField": [
            {
                "fieldID": "<fieldID>",
                "fieldPosition": "<fieldPosition>",
                "formFieldError": "<formFieldError>"
            }
        ],
        "formName": "<formName>",
        "formTemplate": "<formTemplate>",
        "offerID": "<offerID>",
        "formType": "<formType>"
    }

    */