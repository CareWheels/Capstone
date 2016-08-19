// GroupInfo factory for global GroupInfo
angular.module('careWheels')
.factory('GroupInfo', function () {
  var groupInfoService = {};
  var groupInfo = [];
  var memberSelected;
  var sensorError = false;

  groupInfoService.setSensorError = function(boolean){
    sensorError = boolean;
  };
  groupInfoService.getSensorError = function(){
    return sensorError;
  };

  groupInfoService.initGroupInfo = function (data) {
    return groupInfo = data;
  };

  //this function is used at the end of Data Download and Data Analysis
  //it will replace each group members position in the groupInfo array with a newly updated member containing
  //a sensorData object (after Data Download), or a sensorAnalysis object (after Data Analysis)
  groupInfoService.addDataToGroup = function (member, index) {
    groupInfo[index] = member;
  };

  //this function will return the current contents of groupinfo.
  //will be called at the beginning of Data Download, Data Analysis, and group / ind. member summary
  groupInfoService.groupInfo = function () {
    return groupInfo;
  };

  groupInfoService.getMember_new = function () {
    return groupInfo[memberSelected];
  };

  groupInfoService.setMember_new = function (Username) {
    for (var i = 0; i < groupInfo.length; i++) {
      if (groupInfo[i].username == Username)
        memberSelected = i;
    }
    return true;
  };


  groupInfoService.getMember = function (Username) {       // Returns the groupInfo member array index object that contains the same username as the username parameter.
    for (i = 0; i < 5; ++i) {
      if (groupInfo[i].username == Username) {
        console.log("Found " + Username + "==" + groupInfo[i].username);
        return groupInfo[i];
      }

    }

    console.error("In getMember(): Could not find username " + Username);
  };

  groupInfoService.setMember = function (Username, groupInfoMember) {     // Sets the groupInfo array index that contains the same username as the username parameter to the value of the groupInfoMember paramemter.
    for (i = 0; i < 5; ++i) {
      if (groupInfo[i].username == Username) {
        console.log("Found " + Username + "==" + groupInfo[i].username);
        groupInfo[i] = groupInfoMember;
        return true;
      }

    }

    console.error("In setMember(): Could not find username " + Username);
    return false;
  };

  return groupInfoService;

});
