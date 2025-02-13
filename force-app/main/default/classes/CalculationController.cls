public with sharing class CalculationController {
    
    @AuraEnabled
    public static Calculation__c saveCalculation(String value) {
        Calculation__c newCalc = new Calculation__c(Value__c = value);
        insert newCalc;
        return newCalc;
    }

    @AuraEnabled(cacheable=true)
    public static Calculation__c getCalculation(String value) {
        List<Calculation__c> records = [SELECT Id, Value__c FROM Calculation__c WHERE Value__c = :value LIMIT 1];
        return records.isEmpty() ? null : records[0];
    }
}