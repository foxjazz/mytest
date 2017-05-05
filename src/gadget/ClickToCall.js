var finesse = finesse || {};
finesse.gadget = finesse.gadget || {};
finesse.container = finesse.container || {};
clientLogs = finesse.cslogger.ClientLogger || {};  // for logging

/** @namespace */
finesse.modules = finesse.modules || {};
finesse.modules.ClickGadget = (function ($) {
    var rDialog = {};
    var firstActive = false;
    var token = "";
    var gdialogid = "";
    var ex = {};
    var user,
        states,
        dialogs,
        /*
            Populates the fields in the gadget with data
         
              var callvars = dialog.getMediaProperties();
                callvars["callVariable1"] = loanid;
                callvars["callVariable2"] = document.getElementById("userPhone").value;
                callvars.BAAccountNumber = loanid;
                callvars.userLoandID = loanid;
         */
        render = function () {

            clientLogs.log("render(): In method");
            var _util = finesse.utilities.Utilities;
            var config = finesse.gadget.Config || {};
            var userparam = "?userName=" + config.id;
            try {
                token = _util.getUserAuthString();
            } catch (e) {
                token = "error";
            }
            var tok = "&token=" + token;
            var iframe = "<div>";
            iframe += '<iframe src="https://uccx-001-app-prod.statebridgecompany.com:8445/3rdpartygadget/files/testcall/' + userparam + tok + '" width="100%" height="850"> </iframe>';
            iframe += "</div>";
            $('#agentout').html(iframe);

            gadgets.window.adjustHeight();
        },

        // Handler to handle changes in a dialog
        _processCall = function(dialog) {
            clientLogs.log("_processCall(): State = " + dialog.getState());

            if (dialog.getState() === "INITIATED")
                firstActive = false;
            if (dialog.getState() === "ACTIVE") {
                firstActive = true;
                
                //if(dialog.getId() != gdialogid)
                //    render2(dialog.getId());
                //gdialogid = dialog.getId();


            }
            firstActive = false;
            if (dialog.getState() === finesse.restservices.Dialog.States.FAILED) {
                $('#errorMsg').html("Call Failed");
            }
        },

        /**
         *  Handler for additions to the Dialogs collection object.  This will occur when a new
         *  Dialog is created on the Finesse server for this user.
         */
        handleNewDialog = function(dialog) {
            // Get call variables from the dialog
            //var callVars = dialog.getMediaProperties();
            
            // Hide the make call button when the user is on a call
            $('#makeCallButton').hide();
            $('#hangUpButton').show();
            try {
               var t =  finesse.utilities.getUserAuthString(auth => {
                    token = auth;
                    console.log("getToken: " + token + "t:" + t);
                });
            } catch (ex) {
                console.log("exception: " + JSON.stringify(ex));
            }

            //render3();
            // add a change handler to the dialog
            dialog.addHandler('change', _processCall);
        },

        /**
         *  Handler for deletions from the Dialogs collection object for this user.  This will occur
         *  when a Dialog is removed from this user's collection (example, end call)
         */
        handleEndDialog = function(dialog) {
            // Show the make call button when the call is ended
            $('#hangUpButton').hide();
            $('#makeCallButton').show();


        },

        /**
         * Handler for makeCall when successful.
         */
        makeCallSuccess = function(rsp) {},

        /**
         * Handler for makeCall when error occurs.
         */
        makeCallError = function(rsp) {
            $('#errorMsg').html(_util.getErrData(rsp));
        },

        /**
         * Handler for the onLoad of a User object.  This occurs when the User object is initially read
         * from the Finesse server.  Any once only initialization should be done within this function.
         */
        handleUserLoad = function(userevent) {
            // Get an instance of the dialogs collection and register handlers for dialog additions and
            // removals
            dialogs = user.getDialogs({
                onCollectionAdd: handleNewDialog,
                onCollectionDelete: handleEndDialog
            });
            render();
        },

        /**
         *  Handler for all User updates
         */
        handleUserChange = function (userevent) {
            render();
        };

   
    /** @scope finesse.modules.ClickGadget */
    return {
        hangUp2 : function() {
            user.setState("READY");
        },
        /**
         * Make a call to the number
         */
        makeCall : function () {
            // clear the error message before making the call
            $('#errorMsg').html("");
            //user.setState(dialog.States.NOT_READY);
            user.setState("NOT_READY");
            number = document.getElementById("userPhone").value;
         
            

            console.log("vader: number: " + number);
            // Example of the user make call method
            user.makeCall(number, {
                success: makeCallSuccess,
                error: makeCallError
            });
            
            // Hide the button after making the call
            $('#makeCallButton').hide();
            $('#hangUpButton').show();
            
    
        },
            
        /**
         * Performs all initialization for this gadget
         */
        init : function () {
            var cfg = finesse.gadget.Config;

            clientLogs = finesse.cslogger.ClientLogger;   // declare clientLogs
             
            gadgets.window.adjustHeight();
            
            // Initiate the ClientServices and load the user object.  ClientServices are
            // initialized with a reference to the current configuration.
            finesse.clientservices.ClientServices.init(cfg, false);

             // Initiate the ClientLogs. The gadget id will be logged as a part of the message
            clientLogs.init(gadgets.Hub, "ClickToCallClickGadget", finesse.gadget.Config); //this gadget id will be logged as a part of the message
            
            user = new finesse.restservices.User({
                id: cfg.id, 
                onLoad : handleUserLoad,
                onChange : handleUserChange
            });
                
            states = finesse.restservices.User.States;
            
            clientLogs.log ("ClickToCall.init(): completed init");
        }
      
    };

  
}(jQuery));