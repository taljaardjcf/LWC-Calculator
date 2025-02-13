import { LightningElement,track } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import callFlowWithResponse from '@salesforce/apex/Plinqx.FlowService.callFlowWithResponse';

const flowApiName = 'FlowService_Example';

export default class LwcServiceWrapperDemo extends LightningElement {

    @track results = [];  

    handleSearchAddress(event){
      this.results = [];
      let objParams = //the flow input paramaters as an object
      {
          searchParam : event.detail.value //set the input parameter of the flow
      };        
      callFlowWithResponse({
          flowNameSpace: '',//The flow namespace if from package i.e. Plinqx
          flowAPIName: flowApiName, //The flow API Name
          flowParams : objParams,//The flow input paramaters
          flowResponseVariable : 'addressResponse' //The output paratemeter of your flow to retrieve
      })
      .then((result) => {
          this.results = result;
      })
      .catch((error) => {
          this.handleNotification(
              "Address Search",
              error.message,
              "error"
          );
      
      });
    }

    handleResultClick(event){
      //implement result click logic here
    }

    handleNotification(title, message, variant, mode) {
      this.dispatchEvent(
          new ShowToastEvent({
              title,
              message,
              variant,
              mode
          })
      );
  }

}