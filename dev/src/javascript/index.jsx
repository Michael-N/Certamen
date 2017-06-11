"use strict";

// ============== Set up imports for webpack bundle... explicitly list======================

//========== REACT==================
import React from 'react';
import ReactDOM from 'react-dom';

//========== Material ui ===========
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
injectTapEventPlugin();

// ================================== Main Code =========================================

//==================== Question Form Page =======================
    /*
        goals:  good ux, auto check on user stop typing, store files in a global object
    */

    //Header
    var QuestionFormHeader = <div id="QuestionForm-Header"> 
            <h2> Question Form </h2>
        </div>;
    // Tags Component
    class TagsComponent extends React.Component{
        
        //Setup initialize state and explicitly bind the context of 'this'
        constructor(){
            super();
            
            //Explicitly Bind
            this.updateInputTagValue = this.updateInputTagValue.bind(this);
            this.submitTag = this.submitTag.bind(this);
            this.addTag = this.addTag.bind(this);
            this.enterKeySubmitHelper = this.enterKeySubmitHelper.bind(this);
            
            //Set the initial state
            this.state={
                allTags:[]
            }
            //,
            //    placeholder: ""
            
            //helper object (acts like a storage space...)
            this.inputTextValue = undefined;
        }
        
        //this is called when the add button is pressed or when the 'enter' key is pressed it is called by updateInputTagValue
        // this function also determines if the state needs to be updated 
        submitTag(){
            // make sure we are not submitting an empty undefined tag nor one that is all just spaces
            if((this.inputTextValue) && (!(this.inputTextValue.split(" ").length === this.inputTextValue.length ))){
                //add
                this.addTag(this.inputTextValue);
                //reset its value
                this.inputTextValue = undefined;
            }
            
        //For the users Convienence delete the text in the input form (FIND a way to implement this)
        }
        
        //in case the user thinks hittig the enter key while the text field is active will work (which it will now...)
        enterKeySubmitHelper(fevent){
            //Check if the user is pressing the enter key thinking it will auto add
            // debugging purposes // console.log("enterKeySubmit was called because a key was released with code: " + fevent.keyCode);
            if(fevent.keyCode === 13){
                this.submitTag();
            }
        }
        
        //This is called everytime there is a text value change
        updateInputTagValue(fevent,textValue){

            // updates a TagComponent scope variable so it can be accessed by submitTag and addTag when needed...
            this.inputTextValue = textValue;
            
            //debug
            //console.log(fevent);
        }
        
        // this function adds a tag and changes the state... only when submitTag calls it
        addTag(tagName){
            //update state
            this.setState((prevState,props)=>{
                
                // add the item to the list
                prevState.allTags.push(tagName);
                //console.log("[Added Tag]: "+ tagName);
                //prevState.placeholder = "";
                return prevState;
            });
        }
        
        //returns a function bound to the 'this' of TagsComponent that is generated to delete the index 'tagIndex'
        //Every time state is redone durring rendering this is redefined for each chip --> it deletes correctly
        removeTag(tagIndex){
            return ()=>{
                
                //return a function with 'this' un attatched to local context... is attached to TagComponent
                this.setState((prevState,props)=>{

                    //remove a tag...
                    prevState.allTags.splice(tagIndex,1);
                    return prevState;
                });
            };
        }
        
        //render function.. compute chips.. ect....
        render(){
            //=== TagsComponent-tags-container ===
                // Temp chip styling.... move to index.scss..... borrowed directly from Material UI website...
                    const styles = {
                      chip: {
                        margin: 4,
                      },
                      wrapper: {
                        display: 'flex',
                        flexWrap: 'wrap',
                      },
                    };
                // A place to store the compleated react chip jsx
                    var tagsToBeRendered = [];
                //Iterate and setup the tags (chips)
                    for(var i=0; i<this.state.allTags.length; i++){

                        // Create the chip and add its binding 
                        /*      UNTESTED  README!!!!!!!!!!
                            !!!!!!!!!!! onRequestDelete={this.removeTag(i)} may not work because this.removeTag is being called!!!!
                            this.removeTag may need to be a function constructor and return a function with 'i' tagIndex as a set value!!!!

                            also is it ok to change the classname of a react element in material ui?? className="TagsComponent-Chip" see below

                        */
                        var currentChip = <Chip onRequestDelete={this.removeTag(i)} key={i} className="TagsComponent-Chip" style={styles.chip}>{this.state.allTags[i]}</Chip>

                        //Add to the Render List
                        tagsToBeRendered.push(currentChip);
                    }
            
            //=== TagsComponent-input-container ===
                var hintPrompt;
                if(this.state.allTags.length<1){
                   hintPrompt = "Type the name for a tag here";
                }else{
                    hintPrompt = "Add another tag by typing here";
                }
            
            //return the render ... 
                return(
                    <div className="TagsComponent-main-container">
                        <div className="TagsComponent-tags-container" style={styles.wrapper}>
                            {tagsToBeRendered}
                        </div>
                        <div className="TagsComponent-input-container">
                            <TextField hintText={hintPrompt} onKeyDown={this.enterKeySubmitHelper} onChange={this.updateInputTagValue} underlineFocusStyle={{borderColor:"#8A0113"}}/>
                            <FlatButton label="Add" onTouchTap={this.submitTag} id="TagsComponent-button"/>
                        </div>
                    </div>
                );
            //value={this.placeholder} 
        }
    }

//Load the tagsComponent after the dom loads
document.addEventListener("DOMContentLoaded",()=>{
    var Main = ()=>(<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <TagsComponent/>
        </MuiThemeProvider>);
    //convert mui and tagcomponent into one using it as a inline return function ()=>() and render it into the main container
    ReactDOM.render(<Main/>, document.getElementById("main-container"))
});




