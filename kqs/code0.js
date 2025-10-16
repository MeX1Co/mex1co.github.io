gdjs.q1Code = {};
gdjs.q1Code.GDImagesObjects2_1final = [];

gdjs.q1Code.GDFrameObjects1= [];
gdjs.q1Code.GDFrameObjects2= [];
gdjs.q1Code.GDFrameObjects3= [];
gdjs.q1Code.GDFrameObjects4= [];
gdjs.q1Code.GDImagesObjects1= [];
gdjs.q1Code.GDImagesObjects2= [];
gdjs.q1Code.GDImagesObjects3= [];
gdjs.q1Code.GDImagesObjects4= [];
gdjs.q1Code.GDDBGObjects1= [];
gdjs.q1Code.GDDBGObjects2= [];
gdjs.q1Code.GDDBGObjects3= [];
gdjs.q1Code.GDDBGObjects4= [];
gdjs.q1Code.GDbgObjects1= [];
gdjs.q1Code.GDbgObjects2= [];
gdjs.q1Code.GDbgObjects3= [];
gdjs.q1Code.GDbgObjects4= [];
gdjs.q1Code.GDQBgObjects1= [];
gdjs.q1Code.GDQBgObjects2= [];
gdjs.q1Code.GDQBgObjects3= [];
gdjs.q1Code.GDQBgObjects4= [];
gdjs.q1Code.GDquestionsObjects1= [];
gdjs.q1Code.GDquestionsObjects2= [];
gdjs.q1Code.GDquestionsObjects3= [];
gdjs.q1Code.GDquestionsObjects4= [];
gdjs.q1Code.GDnewButObjects1= [];
gdjs.q1Code.GDnewButObjects2= [];
gdjs.q1Code.GDnewButObjects3= [];
gdjs.q1Code.GDnewButObjects4= [];

gdjs.q1Code.conditionTrue_0 = {val:false};
gdjs.q1Code.condition0IsTrue_0 = {val:false};
gdjs.q1Code.condition1IsTrue_0 = {val:false};
gdjs.q1Code.condition2IsTrue_0 = {val:false};
gdjs.q1Code.condition3IsTrue_0 = {val:false};
gdjs.q1Code.conditionTrue_1 = {val:false};
gdjs.q1Code.condition0IsTrue_1 = {val:false};
gdjs.q1Code.condition1IsTrue_1 = {val:false};
gdjs.q1Code.condition2IsTrue_1 = {val:false};
gdjs.q1Code.condition3IsTrue_1 = {val:false};
gdjs.q1Code.conditionTrue_2 = {val:false};
gdjs.q1Code.condition0IsTrue_2 = {val:false};
gdjs.q1Code.condition1IsTrue_2 = {val:false};
gdjs.q1Code.condition2IsTrue_2 = {val:false};
gdjs.q1Code.condition3IsTrue_2 = {val:false};


gdjs.q1Code.eventsList0x22d82988 = function(runtimeScene, context) {

{

gdjs.q1Code.GDImagesObjects2.createFrom(runtimeScene.getObjects("Images"));

gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDImagesObjects2.length;i<l;++i) {
    if ( gdjs.q1Code.GDImagesObjects2[i].getVariableString(gdjs.q1Code.GDImagesObjects2[i].getVariables().getFromIndex(0)) == "L" ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDImagesObjects2[k] = gdjs.q1Code.GDImagesObjects2[i];
        ++k;
    }
}
gdjs.q1Code.GDImagesObjects2.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {
/* Reuse gdjs.q1Code.GDImagesObjects2 */
{runtimeScene.getVariables().getFromIndex(3).setString((( gdjs.q1Code.GDImagesObjects2.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects2[0].getAnimationName()));
}}

}


{

gdjs.q1Code.GDImagesObjects2.createFrom(runtimeScene.getObjects("Images"));

gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDImagesObjects2.length;i<l;++i) {
    if ( gdjs.q1Code.GDImagesObjects2[i].getVariableString(gdjs.q1Code.GDImagesObjects2[i].getVariables().getFromIndex(0)) == "R" ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDImagesObjects2[k] = gdjs.q1Code.GDImagesObjects2[i];
        ++k;
    }
}
gdjs.q1Code.GDImagesObjects2.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {
/* Reuse gdjs.q1Code.GDImagesObjects2 */
{runtimeScene.getVariables().getFromIndex(4).setString((( gdjs.q1Code.GDImagesObjects2.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects2[0].getAnimationName()));
}}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(11)) == -1;
}if (gdjs.q1Code.condition0IsTrue_0.val) {
gdjs.q1Code.GDDBGObjects2.createFrom(runtimeScene.getObjects("DBG"));
{for(var i = 0, len = gdjs.q1Code.GDDBGObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDDBGObjects2[i].hide();
}
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(10);
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(1).setNumber(21);
}}

}


{


{
gdjs.q1Code.GDFrameObjects2.createFrom(runtimeScene.getObjects("Frame"));
{for(var i = 0, len = gdjs.q1Code.GDFrameObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDFrameObjects2[i].setColor(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(2).getChild("Main")));
}
}}

}


{


{
gdjs.q1Code.GDQBgObjects2.createFrom(runtimeScene.getObjects("QBg"));
{for(var i = 0, len = gdjs.q1Code.GDQBgObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDQBgObjects2[i].setColor(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(2).getChild("Main")));
}
}}

}


{


{
gdjs.q1Code.GDnewButObjects2.createFrom(runtimeScene.getObjects("newBut"));
{for(var i = 0, len = gdjs.q1Code.GDnewButObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDnewButObjects2[i].setColor(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(2).getChild("Main")));
}
}}

}


{



}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Spoon").getChild("0").setString("Με ποιο τρώμε;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Spoon").getChild("1").setString("Με τι ανακατεύουμε τη σούπα ή το γιαούρτι;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Chair").getChild("0").setString("Σε τι καθόμαστε;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Chair").getChild("1").setString("Τι έχει τέσσερα πόδια και δεν περπατάει;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Bird").getChild("0").setString("Ποιο πετάει;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Bird").getChild("1").setString("Ποιο έχει φτέρα;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Key").getChild("0").setString("Με ποιο ξεκλειδώνουμε;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Key").getChild("1").setString("Τι βάζουμε στην κλειδαριά;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Bed").getChild("0").setString("Σε ποιο κοιμόμαστε;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Bed").getChild("1").setString("Τι έχει μαξιλάρι και σεντόνια;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Ball").getChild("0").setString("Ποιο είναι στρογγυλό;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Ball").getChild("1").setString("Με ποιο παίζουμε ποδόσφαιρο;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Book").getChild("0").setString("Ποιο διαβάζουμε;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Book").getChild("1").setString("Ποιο έχει σελίδες;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Tree").getChild("0").setString("Ποιο έχει κλαδιά;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Tree").getChild("1").setString("Ποιο έχει φύλλα;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Hen").getChild("0").setString("Ποιο κάνει αυγά;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Hen").getChild("1").setString("Ποιο κάνει ΚΟ ΚΟ ΚΟ;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Cookies").getChild("0").setString("Ποιο τρώγεται;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Cookies").getChild("1").setString("Ποιο έχει κομματάκια σοκολάτας;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Pot").getChild("0").setString("Με ποιο μαγειρεύουμε;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Pot").getChild("1").setString("Ποιο έχει μέσα φαγητό;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Car").getChild("0").setString("Ποιο πάει στο δρόμο;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Car").getChild("1").setString("Ποιο έχει τέσσερις ρόδες;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Plane").getChild("0").setString("Ποιο πετάει;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Plane").getChild("1").setString("Ποιο έχει φτερά;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Train").getChild("0").setString("Ποιο είναι σε ράγες;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Train").getChild("1").setString("Ποιο κάνει ΤΣΑΦ ΤΣΟΥΦ;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Bicycle").getChild("0").setString("Ποιο έχει δύο ρόδες;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Bicycle").getChild("1").setString("Ποιο έχει πετάλια;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Pencil").getChild("0").setString("Με ποιο γράφουμε;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Pencil").getChild("1").setString("Με ποιο ζωγραφίζουμε;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Glass").getChild("0").setString("Με ποιο πίνουμε;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Glass").getChild("1").setString("Ποιο έχει νερό;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Ladder").getChild("0").setString("Ποιο ανεβαίνουμε;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Ladder").getChild("1").setString("Ποιο έχει σκαλιά;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Mouse").getChild("0").setString("Ποιο τρώει τυρί;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Mouse").getChild("1").setString("Ποιο έχει σελίδες;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Cat").getChild("0").setString("Ποιο νιαουρίζει;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Cat").getChild("1").setString("Ποιο έχει σελίδες;");
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(7).getChild("Dog").getChild("0").setString("Ποιο γαυγίζει;");
}{runtimeScene.getVariables().getFromIndex(7).getChild("Dog").getChild("1").setString("Ποιο έχει σελίδες;");
}}

}


{


{
{gdjs.evtTools.window.setFullScreen(runtimeScene, true, true);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d82988
gdjs.q1Code.eventsList0x22d81ae8 = function(runtimeScene, context) {

{

gdjs.q1Code.GDImagesObjects2.createFrom(runtimeScene.getObjects("Images"));

gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDImagesObjects2.length;i<l;++i) {
    if ( gdjs.q1Code.GDImagesObjects2[i].getVariableString(gdjs.q1Code.GDImagesObjects2[i].getVariables().getFromIndex(0)) == "L" ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDImagesObjects2[k] = gdjs.q1Code.GDImagesObjects2[i];
        ++k;
    }
}
gdjs.q1Code.GDImagesObjects2.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {
/* Reuse gdjs.q1Code.GDImagesObjects2 */
{for(var i = 0, len = gdjs.q1Code.GDImagesObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDImagesObjects2[i].setAnimation(gdjs.random(gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(1))-1));
}
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(10.1);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d81ae8
gdjs.q1Code.eventsList0x22d81c08 = function(runtimeScene, context) {

{


{
gdjs.q1Code.GDImagesObjects2.createFrom(gdjs.q1Code.GDImagesObjects1);

{runtimeScene.getVariables().getFromIndex(5).setString((( gdjs.q1Code.GDImagesObjects2.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects2[0].getAnimationName()));
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(10.5);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d81c08
gdjs.q1Code.eventsList0x22d81f68 = function(runtimeScene, context) {

{

gdjs.q1Code.GDImagesObjects2.createFrom(gdjs.q1Code.GDImagesObjects1);


gdjs.q1Code.condition0IsTrue_0.val = false;
{
{gdjs.q1Code.conditionTrue_1 = gdjs.q1Code.condition0IsTrue_0;
gdjs.q1Code.GDImagesObjects2_1final.length = 0;gdjs.q1Code.condition0IsTrue_1.val = false;
gdjs.q1Code.condition1IsTrue_1.val = false;
{
gdjs.q1Code.GDImagesObjects3.createFrom(gdjs.q1Code.GDImagesObjects1);

gdjs.q1Code.condition0IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(3)) == (( gdjs.q1Code.GDImagesObjects3.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects3[0].getAnimationName());
if( gdjs.q1Code.condition0IsTrue_1.val ) {
    gdjs.q1Code.conditionTrue_1.val = true;
    for(var j = 0, jLen = gdjs.q1Code.GDImagesObjects3.length;j<jLen;++j) {
        if ( gdjs.q1Code.GDImagesObjects2_1final.indexOf(gdjs.q1Code.GDImagesObjects3[j]) === -1 )
            gdjs.q1Code.GDImagesObjects2_1final.push(gdjs.q1Code.GDImagesObjects3[j]);
    }
}
}
{
gdjs.q1Code.GDImagesObjects3.createFrom(gdjs.q1Code.GDImagesObjects1);

gdjs.q1Code.condition1IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(4)) == (( gdjs.q1Code.GDImagesObjects3.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects3[0].getAnimationName());
if( gdjs.q1Code.condition1IsTrue_1.val ) {
    gdjs.q1Code.conditionTrue_1.val = true;
    for(var j = 0, jLen = gdjs.q1Code.GDImagesObjects3.length;j<jLen;++j) {
        if ( gdjs.q1Code.GDImagesObjects2_1final.indexOf(gdjs.q1Code.GDImagesObjects3[j]) === -1 )
            gdjs.q1Code.GDImagesObjects2_1final.push(gdjs.q1Code.GDImagesObjects3[j]);
    }
}
}
{
gdjs.q1Code.GDImagesObjects2.createFrom(gdjs.q1Code.GDImagesObjects2_1final);
}
}
}if (gdjs.q1Code.condition0IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(0).setNumber(10);
}}

}


{

/* Reuse gdjs.q1Code.GDImagesObjects1 */

gdjs.q1Code.condition0IsTrue_0.val = false;
{
{gdjs.q1Code.conditionTrue_1 = gdjs.q1Code.condition0IsTrue_0;
gdjs.q1Code.condition0IsTrue_1.val = false;
gdjs.q1Code.condition1IsTrue_1.val = false;
{
gdjs.q1Code.condition0IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(3)) != (( gdjs.q1Code.GDImagesObjects1.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects1[0].getAnimationName());
}if ( gdjs.q1Code.condition0IsTrue_1.val ) {
{
gdjs.q1Code.condition1IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(4)) != (( gdjs.q1Code.GDImagesObjects1.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects1[0].getAnimationName());
}}
gdjs.q1Code.conditionTrue_1.val = true && gdjs.q1Code.condition0IsTrue_1.val && gdjs.q1Code.condition1IsTrue_1.val;
}
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d81c08(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x22d81f68
gdjs.q1Code.eventsList0x22d80d68 = function(runtimeScene, context) {

{

gdjs.q1Code.GDImagesObjects1.createFrom(runtimeScene.getObjects("Images"));

gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDImagesObjects1.length;i<l;++i) {
    if ( gdjs.q1Code.GDImagesObjects1[i].getVariableString(gdjs.q1Code.GDImagesObjects1[i].getVariables().getFromIndex(0)) == "L" ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDImagesObjects1[k] = gdjs.q1Code.GDImagesObjects1[i];
        ++k;
    }
}
gdjs.q1Code.GDImagesObjects1.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d81f68(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x22d80d68
gdjs.q1Code.eventsList0x22d816c8 = function(runtimeScene, context) {

{

gdjs.q1Code.GDImagesObjects2.createFrom(runtimeScene.getObjects("Images"));

gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDImagesObjects2.length;i<l;++i) {
    if ( gdjs.q1Code.GDImagesObjects2[i].getVariableString(gdjs.q1Code.GDImagesObjects2[i].getVariables().getFromIndex(0)) == "R" ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDImagesObjects2[k] = gdjs.q1Code.GDImagesObjects2[i];
        ++k;
    }
}
gdjs.q1Code.GDImagesObjects2.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {
/* Reuse gdjs.q1Code.GDImagesObjects2 */
{for(var i = 0, len = gdjs.q1Code.GDImagesObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDImagesObjects2[i].setAnimation(gdjs.random(gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(1))-1));
}
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(10.6);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d816c8
gdjs.q1Code.eventsList0x22d80f48 = function(runtimeScene, context) {

{


{
gdjs.q1Code.GDImagesObjects2.createFrom(gdjs.q1Code.GDImagesObjects1);

{runtimeScene.getVariables().getFromIndex(6).setString((( gdjs.q1Code.GDImagesObjects2.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects2[0].getAnimationName()));
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(10.62);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d80f48
gdjs.q1Code.eventsList0x22d81968 = function(runtimeScene, context) {

{

gdjs.q1Code.GDImagesObjects2.createFrom(gdjs.q1Code.GDImagesObjects1);


gdjs.q1Code.condition0IsTrue_0.val = false;
{
{gdjs.q1Code.conditionTrue_1 = gdjs.q1Code.condition0IsTrue_0;
gdjs.q1Code.GDImagesObjects2_1final.length = 0;gdjs.q1Code.condition0IsTrue_1.val = false;
gdjs.q1Code.condition1IsTrue_1.val = false;
gdjs.q1Code.condition2IsTrue_1.val = false;
{
gdjs.q1Code.GDImagesObjects3.createFrom(gdjs.q1Code.GDImagesObjects1);

gdjs.q1Code.condition0IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(3)) == (( gdjs.q1Code.GDImagesObjects3.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects3[0].getAnimationName());
if( gdjs.q1Code.condition0IsTrue_1.val ) {
    gdjs.q1Code.conditionTrue_1.val = true;
    for(var j = 0, jLen = gdjs.q1Code.GDImagesObjects3.length;j<jLen;++j) {
        if ( gdjs.q1Code.GDImagesObjects2_1final.indexOf(gdjs.q1Code.GDImagesObjects3[j]) === -1 )
            gdjs.q1Code.GDImagesObjects2_1final.push(gdjs.q1Code.GDImagesObjects3[j]);
    }
}
}
{
gdjs.q1Code.GDImagesObjects3.createFrom(gdjs.q1Code.GDImagesObjects1);

gdjs.q1Code.condition1IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(4)) == (( gdjs.q1Code.GDImagesObjects3.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects3[0].getAnimationName());
if( gdjs.q1Code.condition1IsTrue_1.val ) {
    gdjs.q1Code.conditionTrue_1.val = true;
    for(var j = 0, jLen = gdjs.q1Code.GDImagesObjects3.length;j<jLen;++j) {
        if ( gdjs.q1Code.GDImagesObjects2_1final.indexOf(gdjs.q1Code.GDImagesObjects3[j]) === -1 )
            gdjs.q1Code.GDImagesObjects2_1final.push(gdjs.q1Code.GDImagesObjects3[j]);
    }
}
}
{
gdjs.q1Code.GDImagesObjects3.createFrom(gdjs.q1Code.GDImagesObjects1);

gdjs.q1Code.condition2IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(5)) == (( gdjs.q1Code.GDImagesObjects3.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects3[0].getAnimationName());
if( gdjs.q1Code.condition2IsTrue_1.val ) {
    gdjs.q1Code.conditionTrue_1.val = true;
    for(var j = 0, jLen = gdjs.q1Code.GDImagesObjects3.length;j<jLen;++j) {
        if ( gdjs.q1Code.GDImagesObjects2_1final.indexOf(gdjs.q1Code.GDImagesObjects3[j]) === -1 )
            gdjs.q1Code.GDImagesObjects2_1final.push(gdjs.q1Code.GDImagesObjects3[j]);
    }
}
}
{
gdjs.q1Code.GDImagesObjects2.createFrom(gdjs.q1Code.GDImagesObjects2_1final);
}
}
}if (gdjs.q1Code.condition0IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(0).setNumber(10.5);
}}

}


{

/* Reuse gdjs.q1Code.GDImagesObjects1 */

gdjs.q1Code.condition0IsTrue_0.val = false;
{
{gdjs.q1Code.conditionTrue_1 = gdjs.q1Code.condition0IsTrue_0;
gdjs.q1Code.condition0IsTrue_1.val = false;
gdjs.q1Code.condition1IsTrue_1.val = false;
gdjs.q1Code.condition2IsTrue_1.val = false;
{
gdjs.q1Code.condition0IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(3)) != (( gdjs.q1Code.GDImagesObjects1.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects1[0].getAnimationName());
}if ( gdjs.q1Code.condition0IsTrue_1.val ) {
{
gdjs.q1Code.condition1IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(4)) != (( gdjs.q1Code.GDImagesObjects1.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects1[0].getAnimationName());
}if ( gdjs.q1Code.condition1IsTrue_1.val ) {
{
gdjs.q1Code.condition2IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(5)) != (( gdjs.q1Code.GDImagesObjects1.length === 0 ) ? "" :gdjs.q1Code.GDImagesObjects1[0].getAnimationName());
}}
}
gdjs.q1Code.conditionTrue_1.val = true && gdjs.q1Code.condition0IsTrue_1.val && gdjs.q1Code.condition1IsTrue_1.val && gdjs.q1Code.condition2IsTrue_1.val;
}
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d80f48(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x22d81968
gdjs.q1Code.eventsList0x22d81fc8 = function(runtimeScene, context) {

{

gdjs.q1Code.GDImagesObjects1.createFrom(runtimeScene.getObjects("Images"));

gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDImagesObjects1.length;i<l;++i) {
    if ( gdjs.q1Code.GDImagesObjects1[i].getVariableString(gdjs.q1Code.GDImagesObjects1[i].getVariables().getFromIndex(0)) == "R" ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDImagesObjects1[k] = gdjs.q1Code.GDImagesObjects1[i];
        ++k;
    }
}
gdjs.q1Code.GDImagesObjects1.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d81968(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x22d81fc8
gdjs.q1Code.eventsList0x22d82328 = function(runtimeScene, context) {

{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
{gdjs.q1Code.conditionTrue_1 = gdjs.q1Code.condition0IsTrue_0;
gdjs.q1Code.condition0IsTrue_1.val = false;
gdjs.q1Code.condition1IsTrue_1.val = false;
{
{gdjs.q1Code.conditionTrue_2 = gdjs.q1Code.condition0IsTrue_1;
gdjs.q1Code.condition0IsTrue_2.val = false;
gdjs.q1Code.condition1IsTrue_2.val = false;
{
gdjs.q1Code.condition0IsTrue_2.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(6)) == "Bird";
}if ( gdjs.q1Code.condition0IsTrue_2.val ) {
{
gdjs.q1Code.condition1IsTrue_2.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(5)) == "Plane";
}}
gdjs.q1Code.conditionTrue_2.val = true && gdjs.q1Code.condition0IsTrue_2.val && gdjs.q1Code.condition1IsTrue_2.val;
}
if( gdjs.q1Code.condition0IsTrue_1.val ) {
    gdjs.q1Code.conditionTrue_1.val = true;
}
}
{
{gdjs.q1Code.conditionTrue_2 = gdjs.q1Code.condition1IsTrue_1;
gdjs.q1Code.condition0IsTrue_2.val = false;
gdjs.q1Code.condition1IsTrue_2.val = false;
{
gdjs.q1Code.condition0IsTrue_2.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(5)) == "Bird";
}if ( gdjs.q1Code.condition0IsTrue_2.val ) {
{
gdjs.q1Code.condition1IsTrue_2.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(6)) == "Plane";
}}
gdjs.q1Code.conditionTrue_2.val = true && gdjs.q1Code.condition0IsTrue_2.val && gdjs.q1Code.condition1IsTrue_2.val;
}
if( gdjs.q1Code.condition1IsTrue_1.val ) {
    gdjs.q1Code.conditionTrue_1.val = true;
}
}
{
}
}
}if (gdjs.q1Code.condition0IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(0).setNumber(10.5);
}}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
{gdjs.q1Code.conditionTrue_1 = gdjs.q1Code.condition0IsTrue_0;
gdjs.q1Code.condition0IsTrue_1.val = false;
gdjs.q1Code.condition1IsTrue_1.val = false;
{
gdjs.q1Code.condition0IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(6)) != "Plane";
if( gdjs.q1Code.condition0IsTrue_1.val ) {
    gdjs.q1Code.conditionTrue_1.val = true;
}
}
{
gdjs.q1Code.condition1IsTrue_1.val = gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(6)) != "Bird";
if( gdjs.q1Code.condition1IsTrue_1.val ) {
    gdjs.q1Code.conditionTrue_1.val = true;
}
}
{
}
}
}if (gdjs.q1Code.condition0IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(0).setNumber(10.7);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d82328
gdjs.q1Code.eventsList0x22d82808 = function(runtimeScene, context) {

{


{
{runtimeScene.getVariables().getFromIndex(8).setNumber(gdjs.random(1));
}{runtimeScene.getVariables().getFromIndex(9).setNumber(0);
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(20);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d82808
gdjs.q1Code.eventsList0x22d82448 = function(runtimeScene, context) {

{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(8)) == 0;
}if (gdjs.q1Code.condition0IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(10).setString(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(5)));
}}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(8)) == 1;
}if (gdjs.q1Code.condition0IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(10).setString(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(6)));
}}

}


{


{
gdjs.q1Code.GDquestionsObjects2.createFrom(runtimeScene.getObjects("questions"));
{for(var i = 0, len = gdjs.q1Code.GDquestionsObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDquestionsObjects2[i].setString("Ερώτηση: " + gdjs.evtTools.string.newLine() + gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(7).getChild(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(10))).getChild(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(9)))));
}
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(50);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d82448
gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDnewButObjects2Objects = Hashtable.newFrom({"newBut": gdjs.q1Code.GDnewButObjects2});gdjs.q1Code.eventsList0x22d827a8 = function(runtimeScene, context) {

{


gdjs.q1Code.condition0IsTrue_0.val = false;
gdjs.q1Code.condition1IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
}if ( gdjs.q1Code.condition0IsTrue_0.val ) {
{
{gdjs.q1Code.conditionTrue_1 = gdjs.q1Code.condition1IsTrue_0;
gdjs.q1Code.conditionTrue_1.val = context.triggerOnce(585418412);
}
}}
if (gdjs.q1Code.condition1IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(0).setNumber(55);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d827a8
gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDImagesObjects1Objects = Hashtable.newFrom({"Images": gdjs.q1Code.GDImagesObjects1});gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDFrameObjects3Objects = Hashtable.newFrom({"Frame": gdjs.q1Code.GDFrameObjects3});gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDImagesObjects3Objects = Hashtable.newFrom({"Images": gdjs.q1Code.GDImagesObjects3});gdjs.q1Code.eventsList0x22d81e48 = function(runtimeScene, context) {

{

gdjs.q1Code.GDFrameObjects3.createFrom(runtimeScene.getObjects("Frame"));
gdjs.q1Code.GDImagesObjects3.createFrom(gdjs.q1Code.GDImagesObjects2);


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDFrameObjects3Objects, gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDImagesObjects3Objects, false, runtimeScene);
}if (gdjs.q1Code.condition0IsTrue_0.val) {
/* Reuse gdjs.q1Code.GDFrameObjects3 */
{for(var i = 0, len = gdjs.q1Code.GDFrameObjects3.length ;i < len;++i) {
    gdjs.q1Code.GDFrameObjects3[i].setAnimation(2);
}
}{for(var i = 0, len = gdjs.q1Code.GDFrameObjects3.length ;i < len;++i) {
    gdjs.q1Code.GDFrameObjects3[i].setColor("0;255;0");
}
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(60);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d81e48
gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDFrameObjects2Objects = Hashtable.newFrom({"Frame": gdjs.q1Code.GDFrameObjects2});gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDImagesObjects2Objects = Hashtable.newFrom({"Images": gdjs.q1Code.GDImagesObjects2});gdjs.q1Code.eventsList0x22d82388 = function(runtimeScene, context) {

{

gdjs.q1Code.GDFrameObjects2.createFrom(runtimeScene.getObjects("Frame"));
gdjs.q1Code.GDImagesObjects2.createFrom(gdjs.q1Code.GDImagesObjects1);


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDFrameObjects2Objects, gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDImagesObjects2Objects, false, runtimeScene);
}if (gdjs.q1Code.condition0IsTrue_0.val) {
/* Reuse gdjs.q1Code.GDFrameObjects2 */
{for(var i = 0, len = gdjs.q1Code.GDFrameObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDFrameObjects2[i].setAnimation(1);
}
}{for(var i = 0, len = gdjs.q1Code.GDFrameObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDFrameObjects2[i].setColor("255;0;0");
}
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(70);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d82388
gdjs.q1Code.eventsList0x22d829e8 = function(runtimeScene, context) {

{

gdjs.q1Code.GDImagesObjects2.createFrom(gdjs.q1Code.GDImagesObjects1);


gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDImagesObjects2.length;i<l;++i) {
    if ( gdjs.q1Code.GDImagesObjects2[i].isCurrentAnimationName(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(10))) ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDImagesObjects2[k] = gdjs.q1Code.GDImagesObjects2[i];
        ++k;
    }
}
gdjs.q1Code.GDImagesObjects2.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d81e48(runtimeScene, context);} //End of subevents
}

}


{

/* Reuse gdjs.q1Code.GDImagesObjects1 */

gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDImagesObjects1.length;i<l;++i) {
    if ( !(gdjs.q1Code.GDImagesObjects1[i].isCurrentAnimationName(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(10)))) ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDImagesObjects1[k] = gdjs.q1Code.GDImagesObjects1[i];
        ++k;
    }
}
gdjs.q1Code.GDImagesObjects1.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d82388(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x22d829e8
gdjs.q1Code.eventsList0x22d82508 = function(runtimeScene, context) {

{


gdjs.q1Code.condition0IsTrue_0.val = false;
gdjs.q1Code.condition1IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
}if ( gdjs.q1Code.condition0IsTrue_0.val ) {
{
{gdjs.q1Code.conditionTrue_1 = gdjs.q1Code.condition1IsTrue_0;
gdjs.q1Code.conditionTrue_1.val = context.triggerOnce(585418124);
}
}}
if (gdjs.q1Code.condition1IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d829e8(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x22d82508
gdjs.q1Code.eventsList0x22d82aa8 = function(runtimeScene, context) {

{


gdjs.q1Code.condition0IsTrue_0.val = false;
gdjs.q1Code.condition1IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.input.wasKeyReleased(runtimeScene, "Space");
}if ( gdjs.q1Code.condition0IsTrue_0.val ) {
{
{gdjs.q1Code.conditionTrue_1 = gdjs.q1Code.condition1IsTrue_0;
gdjs.q1Code.conditionTrue_1.val = context.triggerOnce(585418700);
}
}}
if (gdjs.q1Code.condition1IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(0).setNumber(55);
}}

}


{

gdjs.q1Code.GDnewButObjects2.createFrom(runtimeScene.getObjects("newBut"));

gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.input.cursorOnObject(gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDnewButObjects2Objects, runtimeScene, true, false);
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d827a8(runtimeScene, context);} //End of subevents
}

}


{

gdjs.q1Code.GDImagesObjects1.createFrom(runtimeScene.getObjects("Images"));

gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.input.cursorOnObject(gdjs.q1Code.mapOfGDgdjs_46q1Code_46GDImagesObjects1Objects, runtimeScene, true, false);
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d82508(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x22d82aa8
gdjs.q1Code.eventsList0x22d822c8 = function(runtimeScene, context) {

{


{
{runtimeScene.getVariables().getFromIndex(3).setString(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(5)));
}{runtimeScene.getVariables().getFromIndex(4).setString(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(6)));
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(10);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d822c8
gdjs.q1Code.eventsList0x22d82bc8 = function(runtimeScene, context) {

{


{
gdjs.q1Code.GDFrameObjects2.createFrom(gdjs.q1Code.GDFrameObjects1);

{for(var i = 0, len = gdjs.q1Code.GDFrameObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDFrameObjects2[i].setAnimation(0);
}
}{for(var i = 0, len = gdjs.q1Code.GDFrameObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDFrameObjects2[i].setColor(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(2).getChild("Main")));
}
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(55);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d82bc8
gdjs.q1Code.eventsList0x22d82a48 = function(runtimeScene, context) {

{

/* Reuse gdjs.q1Code.GDFrameObjects1 */

gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDFrameObjects1.length;i<l;++i) {
    if ( gdjs.q1Code.GDFrameObjects1[i].hasAnimationEnded() ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDFrameObjects1[k] = gdjs.q1Code.GDFrameObjects1[i];
        ++k;
    }
}
gdjs.q1Code.GDFrameObjects1.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d82bc8(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x22d82a48
gdjs.q1Code.eventsList0x22d828c8 = function(runtimeScene, context) {

{

gdjs.q1Code.GDFrameObjects1.createFrom(runtimeScene.getObjects("Frame"));

gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDFrameObjects1.length;i<l;++i) {
    if ( gdjs.q1Code.GDFrameObjects1[i].getAnimation() == 2 ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDFrameObjects1[k] = gdjs.q1Code.GDFrameObjects1[i];
        ++k;
    }
}
gdjs.q1Code.GDFrameObjects1.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d82a48(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x22d828c8
gdjs.q1Code.eventsList0x22d81d28 = function(runtimeScene, context) {

{


{
gdjs.q1Code.GDFrameObjects2.createFrom(gdjs.q1Code.GDFrameObjects1);

{for(var i = 0, len = gdjs.q1Code.GDFrameObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDFrameObjects2[i].setAnimation(0);
}
}{for(var i = 0, len = gdjs.q1Code.GDFrameObjects2.length ;i < len;++i) {
    gdjs.q1Code.GDFrameObjects2[i].setColor(gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(2).getChild("Main")));
}
}}

}


{


{
{runtimeScene.getVariables().getFromIndex(0).setNumber(50);
}}

}


}; //End of gdjs.q1Code.eventsList0x22d81d28
gdjs.q1Code.eventsList0x22d81ba8 = function(runtimeScene, context) {

{

/* Reuse gdjs.q1Code.GDFrameObjects1 */

gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDFrameObjects1.length;i<l;++i) {
    if ( gdjs.q1Code.GDFrameObjects1[i].hasAnimationEnded() ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDFrameObjects1[k] = gdjs.q1Code.GDFrameObjects1[i];
        ++k;
    }
}
gdjs.q1Code.GDFrameObjects1.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d81d28(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x22d81ba8
gdjs.q1Code.eventsList0x22d80e88 = function(runtimeScene, context) {

{

gdjs.q1Code.GDFrameObjects1.createFrom(runtimeScene.getObjects("Frame"));

gdjs.q1Code.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.q1Code.GDFrameObjects1.length;i<l;++i) {
    if ( gdjs.q1Code.GDFrameObjects1[i].getAnimation() == 1 ) {
        gdjs.q1Code.condition0IsTrue_0.val = true;
        gdjs.q1Code.GDFrameObjects1[k] = gdjs.q1Code.GDFrameObjects1[i];
        ++k;
    }
}
gdjs.q1Code.GDFrameObjects1.length = k;}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d81ba8(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x22d80e88
gdjs.q1Code.eventsList0x28e238 = function(runtimeScene, context) {

{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d82988(runtimeScene, context);} //End of subevents
}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(11)) == 1;
}if (gdjs.q1Code.condition0IsTrue_0.val) {
gdjs.q1Code.GDDBGObjects1.createFrom(runtimeScene.getObjects("DBG"));
{for(var i = 0, len = gdjs.q1Code.GDDBGObjects1.length ;i < len;++i) {
    gdjs.q1Code.GDDBGObjects1[i].setString("GS: " + gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(0)) 
+ gdjs.evtTools.string.newLine() + gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(3))
+ gdjs.evtTools.string.newLine() + gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(4))
+ gdjs.evtTools.string.newLine() + gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(5))
+ gdjs.evtTools.string.newLine() + gdjs.evtTools.common.getVariableString(runtimeScene.getVariables().getFromIndex(6)));
}
}}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) == 10;
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d81ae8(runtimeScene, context);} //End of subevents
}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) == 10.1;
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d80d68(runtimeScene, context);} //End of subevents
}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) == 10.5;
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d816c8(runtimeScene, context);} //End of subevents
}

}


{



}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) == 10.6;
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d81fc8(runtimeScene, context);} //End of subevents
}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) == 10.62;
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d82328(runtimeScene, context);} //End of subevents
}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) == 10.7;
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d82808(runtimeScene, context);} //End of subevents
}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) == 20;
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d82448(runtimeScene, context);} //End of subevents
}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) == 50;
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d82aa8(runtimeScene, context);} //End of subevents
}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) == 55;
}if (gdjs.q1Code.condition0IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(0).setNumber(55);
}
{ //Subevents
gdjs.q1Code.eventsList0x22d822c8(runtimeScene, context);} //End of subevents
}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) == 60;
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d828c8(runtimeScene, context);} //End of subevents
}

}


{


gdjs.q1Code.condition0IsTrue_0.val = false;
{
gdjs.q1Code.condition0IsTrue_0.val = gdjs.evtTools.common.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) == 70;
}if (gdjs.q1Code.condition0IsTrue_0.val) {

{ //Subevents
gdjs.q1Code.eventsList0x22d80e88(runtimeScene, context);} //End of subevents
}

}


}; //End of gdjs.q1Code.eventsList0x28e238


gdjs.q1Code.func = function(runtimeScene, context) {
context.startNewFrame();
gdjs.q1Code.GDFrameObjects1.length = 0;
gdjs.q1Code.GDFrameObjects2.length = 0;
gdjs.q1Code.GDFrameObjects3.length = 0;
gdjs.q1Code.GDFrameObjects4.length = 0;
gdjs.q1Code.GDImagesObjects1.length = 0;
gdjs.q1Code.GDImagesObjects2.length = 0;
gdjs.q1Code.GDImagesObjects3.length = 0;
gdjs.q1Code.GDImagesObjects4.length = 0;
gdjs.q1Code.GDDBGObjects1.length = 0;
gdjs.q1Code.GDDBGObjects2.length = 0;
gdjs.q1Code.GDDBGObjects3.length = 0;
gdjs.q1Code.GDDBGObjects4.length = 0;
gdjs.q1Code.GDbgObjects1.length = 0;
gdjs.q1Code.GDbgObjects2.length = 0;
gdjs.q1Code.GDbgObjects3.length = 0;
gdjs.q1Code.GDbgObjects4.length = 0;
gdjs.q1Code.GDQBgObjects1.length = 0;
gdjs.q1Code.GDQBgObjects2.length = 0;
gdjs.q1Code.GDQBgObjects3.length = 0;
gdjs.q1Code.GDQBgObjects4.length = 0;
gdjs.q1Code.GDquestionsObjects1.length = 0;
gdjs.q1Code.GDquestionsObjects2.length = 0;
gdjs.q1Code.GDquestionsObjects3.length = 0;
gdjs.q1Code.GDquestionsObjects4.length = 0;
gdjs.q1Code.GDnewButObjects1.length = 0;
gdjs.q1Code.GDnewButObjects2.length = 0;
gdjs.q1Code.GDnewButObjects3.length = 0;
gdjs.q1Code.GDnewButObjects4.length = 0;

gdjs.q1Code.eventsList0x28e238(runtimeScene, context);return;
}
gdjs['q1Code']= gdjs.q1Code;
