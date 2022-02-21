
function showModal(command, titleHtml, contentHtml, buttons) {
    //remove the model that is already preasent
    var ex_modal= document.getElementsByClassName("modal");
    if(ex_modal.length>0)
    {
        console.log("removing exesting modal div's");
        for (var i = 0; i < ex_modal.length; i++) {
            ex_modal[0].parentNode.removeChild(ex_modal[0]);
        }
    }
    else{ //first time opening the modal so the variables need to be reset
        console.log("###### -> reset the variables ");
        //initCommandConsole();
    }
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
          <div class="modal__inner">
              <div class="modal__top">
                  <div class="modal__title">${titleHtml}</div>
                  <button class="modal__close" type="button">
                      <span class="material-icons">X</span>
                  </button>
              </div>
              <div class="modal__content">${contentHtml}</div>
              <div class="modal__bottom"></div>
          </div>
      `;
  
    for (const button of buttons) {
      const element = document.createElement("button");
  
      element.setAttribute("type", "button");
      element.classList.add("modal__button");
      element.textContent = button.label;
      element.addEventListener("click", () => {
        if (button.triggerClose) {
            document.getElementById("myTopnav").style.top = "0px";
          document.body.removeChild(modal);
        }
  
        button.onClick(modal);
      });
  
      modal.querySelector(".modal__bottom").appendChild(element);
    }
  
    modal.querySelector(".modal__close").addEventListener("click", () => {
        document.getElementById("myTopnav").style.top = "0px";
      document.body.removeChild(modal);
    });
  
    document.body.appendChild(modal);
    if(command==true){
        console.log("initCommandConsole");
        initiateCommandVariable(modal);
        
    }
  }
const content1 =`<p>I am the content of this modal</p><ul><li><code>help</code> : basic help command gives an overview.</li><li><code>command [-filter] [parameter|parameters]</code> : general command syntax.</li><li><code>help [command]</code> : this will give the available filters for the command.</li><li>click "Next >" once ready ..</li></ul>`;
const content2 ='<div id="console_content"><div id="console_output"></div><div id="console_input"></div><div id="console_cursor">_</div></div>';

function showModalInit(){
    document.getElementById("myTopnav").style.top = "-90px";
    showModal(false , "Command in your Hand!",content1 , [
        {
            label: "Decline",
            onClick: (modal) => {
              console.log("DECLINED.");
            },
            triggerClose: true
          },
        {
          label: "Next >",
          onClick: (modal) => {
            console.log("changing the comtent");
            showModal(true,"Command in your Hand!",content2,[
                {
                    label: "< Previous",
                    onClick: (modal) => {
                        console.log("previous page");
                        showModalInit();
                    },
                    triggerClose:false
                },
                {
                    label: "GoBack to the site",
                    onClick: (modal) => {
                        console.log("going back to the site");
                    },
                    triggerClose: true
                }
            ]);
          },
          triggerClose: false
        }
      ]);
}

//#####################################################################################################################
//#####################################################################################################################
//#####################################################################################################################
//#####################################################################################################################
//#####################################################################################################################
//#####################################################################################################################
//inti function for the commandConsole called when the model is loaded clears the cache in variables


function initiateCommandVariable(modal){
    var userName = 'User'+ (Math.floor(Math.random() * 300) + 50);
    var jsConsole = 
    {
        
        cmd_list : [],
        cmd_prompt : "<span class='h-color'>"+userName+"@lokanadh.github.io:~$ </span>",
        cmd_history : [],
        cmd_histroy_size: 16,
        cmd_index : -1,	
        
        input_elm : null,
        output_elm : null,
        
        in_buffer : "",
        tmp_buffer : "",
        input_buffer_max : 256,
        
        init : function()
        {
            // save common elements
            this.input_elm = document.getElementById('console_input');
            this.output_elm = document.getElementById('console_output');
            this.content_elm = document.getElementById('console_content');
            
            // bind to global keypress events
            document.addEventListener('keydown', function(event)
            {
                // the backspace key. prevent default action going back in the browser
                if (event.keyCode === 8)
                {
                    jsConsole.handle_key(event);
                    return false;
                }
                // the arrow keys are used for going through the command history
                else if (event.keyCode >= 37 && event.keyCode <= 40)
                {	
                    jsConsole.handle_key(event);
                    return false;
                }
            });
            
            // handle other keys in the keypress event
            document.addEventListener('keypress', this.handle_key);
            
            // clear the input so the prompt updates
            this.input_clear();
        },
        
        handle_key : function(event)
        {
            if (event.keyCode === 10)
                return;
                
            var self = jsConsole;
                
            if (event.keyCode === 8) // handle backspace
            {
                self.input_log(self.in_buffer.slice(0, self.in_buffer.length-1));
            }
            // enter key pressed. parse then run the command
            else if (event.keyCode === 13)
            {
                // echo the command and clear the input
                var cmd_string = self.in_buffer;
                self.input_clear();
                self.log(self.cmd_prompt + cmd_string);
                
                // reset the history pointer and add the command if it parsed. i.e not empty
                self.cmd_index = -1;
                
                // parse the string to get the command and arguments
                var cmd_obj = self.parse_cmd(cmd_string);
                
                // if th ecommand is not empty, run the command and save the command string to the history
                if (cmd_obj.cmd != "")
                {
                    self.run_cmd(cmd_obj.cmd, cmd_obj.args);
                    self.add_cmd_history(cmd_string);
                }
            }
            // key up and down. use to move up and down through the history
            else if (event.charCode == 0 && (event.keyCode >= 37 && event.keyCode <= 40)) // arrow keys
            {
                if (event.keyCode === 38)
                {
                    if (self.cmd_history.length > 0)
                    {
                        if (self.cmd_index < self.cmd_history.length-1)
                            self.cmd_index++;
                        
                        self.in_buffer = self.cmd_history[self.cmd_index];
                        self.input_log(self.in_buffer);
                    }
                }
                else if (event.keyCode === 40) // down key pressed
                {
                    if (self.cmd_index > -1)
                        self.cmd_index--;
                        
                    if (self.cmd_index > -1 )
                        self.input_log(self.cmd_history[self.cmd_index]);
                    else
                        self.input_log("");
                }
            }
            else	// handle other characters
            {
                if (self.in_buffer.length < self.input_buffer_max)
                    self.input_log(self.in_buffer +String.fromCharCode(event.which));
            }
        },

        // add a new command to the console
        // name: name of the command
        // desc: short description displayed by help command
        // help: detailed help displayed when running help command_name
        // callback: the function to run when the command is run
        // flags: 
        add_cmd : function(name, desc, help, callback, flags)
        {
            // add the command to the command list and sort the commands alphabetically
            this.cmd_list.push({ "name" : name.toLowerCase(), "desc" : desc, "help" : help, "callback" : callback, "flags" : flags});
            
            this.cmd_list.sort(function(a, b)
            {
                return (a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0);
            });
        },
        
        // return the command object for the specified name
        // returns 0 if the command is not found
        get_cmd : function(cmd_name)
        {
            for (var i =0 ; i< this.cmd_list.length ; i++)
            {
                if (this.cmd_list[i].name === cmd_name)
                    return this.cmd_list[i];
            }
            
            return 0;
        },
        
        // parses a string into the command and an array of arguments
        // return object { cmd:"cmd_name", args:[args_array] }
        parse_cmd : function(cmd_string)
        {
            // replace extra whitespace
            var parts = cmd_string.trim().replace(/\s+/g, " ").split(" ");
            var cmd = parts[0];
            var args = parts.length > 1 ? parts.slice(1, parts.length) : [];
            
            return { "cmd" : cmd, "args" : args };
        },
        
        // run the command by calling the command's callback function
        run_cmd : function(cmd, args)
        {
            // find the command
            var cmd_obj = this.get_cmd(cmd);

            if (cmd_obj === 0)
                this.log("Command not recognized : " + cmd + "\n");
            else
            {
                // run the callback if provided
                if (typeof(cmd_obj.callback) === 'function')
                    cmd_obj.callback(args);			
            }
        },
        
        // print text to the console buffer
        log : function(str)
        {
            // add the text to the div element and scroll to the top
            this.output_elm.innerHTML += (str + "\n");
            this.input_log("");
            this.input_elm.scrollIntoView();
        },
        
        // used to write log text to a temporary buffer
        // this will prevent the log from refreshing after each log command
        // use this if you want to print out lots of log information
        // and flush the buffer when done
        log_buffer : function(str)
        {
            this.tmp_buffer += str;
        },
        
        // this dumps the log buffer to the log output
        buffer_flush : function()
        {
            this.log(this.tmp_buffer);
            this.buffer_clear();
        },
        
        buffer_clear : function()	
        {
            this.tmp_buffer = "";
        },
        
        // clear the output buffer of the console
        log_clear : function()
        {
            this.output_elm.innerHTML="";
        },

        // print text to the input buffer
        input_log : function(str)
        {
            this.in_buffer = str;
            this.input_elm.innerHTML=this.cmd_prompt + str;
        },		
        
        // clear the input buffer
        input_clear : function()
        {
            this.in_buffer = "";		
            this.input_elm.innerHtml=this.cmd_prompt;
        },
        
        // add the command string to the command history
        add_cmd_history : function(str)
        {
            this.cmd_history.unshift(str);
            
            if (this.cmd_history.length >= this.cmd_history_size)
                this.cmd_history.pop();
        },
        
        // reset the command history
        clear_cmd_history : function()
        {
            this.cmd_history = [];
        },
    }

    // creating the functions ..
    jsConsole.add_cmd("help", "provides help information for commands", "provides help information for commands\nUsage: HELP [command-name]", cmd_help);

    function cmd_help(args)
    {
        // if we don't have args, display command list
        if (args.length == 0)
        {
            // going to buffer the commands as an example
            jsConsole.buffer_clear();
            
            jsConsole.log_buffer("For more information on a specific command, type <code>help [command-name]</code>\n\n");
            jsConsole.cmd_list.forEach(function(cmd)
            {
                var flags = cmd.flags;
                
                // if the command is not hidden, display the command
                if (typeof(flags) !== "undefined" && flags.hidden === true)
                {
                }
                else
                {
                    // write to the temporary buffer
                    jsConsole.log_buffer("<code>"+cmd.name.padEnd(25) + "</code>:\t" + cmd.desc + "\n");
                }
            });
            
            // dump the buffer
            jsConsole.buffer_flush();
        }
        // display detailed help for command
        else
        {
            // get the command
            var cmd = jsConsole.get_cmd(args[0]);
            
            // if the command doesn't exist, display error message
            if (cmd === 0)
                jsConsole.log("Could not display help info for specified command : " + args[0] + "\n");
            else
            {
                // if the detailed help is a function, call the function
                if (typeof(cmd.help) === 'function')
                    cmd.help();	
                // just print out the string
                else if (typeof(cmd.help) === 'string')
                    jsConsole.log(cmd.help);					
            }
        }
    }

    // the clear command just clears the output text
    // will provide a function for the help to show how a help callback works
    jsConsole.add_cmd("clear", "clears the command window", cmd_clear_help, function cmd_clear(args)
    {
        jsConsole.log_clear();
    });

    function cmd_clear_help()
    {
        jsConsole.buffer_clear();
        jsConsole.log_buffer("\n\t"+ "Command :".padEnd(18)+" <code>clear</code>\n");
        jsConsole.log_buffer("This command clears all the output log from the console. Once cleared you can no longer see the output logs. However the histor can be still loaded from the arrow keys.\n");
        jsConsole.log_buffer("\t"+"Syntax :".padEnd(18)+" <code>clear</code>\n");
        jsConsole.buffer_flush();
    }

    jsConsole.add_cmd("version", "shows the OS version", "Detailed help information goes here.\n", function cmd_version(args)
    {
        jsConsole.log("Javascript OS [Version 1.2.4275]\nCopyright (c) 1867 Javascript Corporation.\n");
    });

    // print the date
    // added some arguments to show how arguments are passed
    jsConsole.add_cmd("date", "prints the current date and time", "Usage: date\ndate\t\tprints out the current date\ndate [system]\tprints out the system date\n", function cmd_date(args)
    {
        if (args.length > 0 && args[0] == "system")
        {
            var date = new Date(1867,6,11,16,0,0,0);	
            jsConsole.log("System Date: " + date + "\n");
        }
        else
        {
            var date = new Date();
            jsConsole.log("Now Date: " + date + "\n");		
        }
    });

    // example command
    // this will print out a welcome message and the all the arguments
    jsConsole.add_cmd("hello", "prints a welcome message to the user", "Usage: hello [name]\n", function(args)
    {
        var arg_string = "";
        
        args.forEach( function( value )
        {
            arg_string += " " + value;
        });
        
        jsConsole.log( "Welcome" + arg_string + " #"+userName+"\n");
    });

    jsConsole.init();
    jsConsole.run_cmd("version");
    jsConsole.log("For help on available commands type \"help\"\n");
    jsConsole.input_log("");
} //end of initalizeCommandVariable function