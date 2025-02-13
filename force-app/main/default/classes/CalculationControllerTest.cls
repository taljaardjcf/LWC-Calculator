@IsTest
public class CalculationControllerTest {
    
    @TestSetup
    static void setupTestData() {
        // Insert a sample Calculation__c record for testing retrieval
        Calculation__c testCalc = new Calculation__c(Value__c = '42');
        insert testCalc;
    }

    @IsTest
    static void testSaveCalculation() {
        // Test saving a new calculation
        Test.startTest();
        Calculation__c savedCalc = CalculationController.saveCalculation('100');
        Test.stopTest();

        // Verify the record was inserted correctly
        Calculation__c retrievedCalc = [SELECT Id, Value__c FROM Calculation__c WHERE Id = :savedCalc.Id LIMIT 1];
        System.assertNotEquals(null, retrievedCalc, 'Calculation should be saved.');
        System.assertEquals('100', retrievedCalc.Value__c, 'Saved value should match input.');
    }

    @IsTest
    static void testGetCalculation_Found() {
        // Test retrieving an existing calculation
        Test.startTest();
        Calculation__c retrievedCalc = CalculationController.getCalculation('42');
        Test.stopTest();

        // Validate the result
        System.assertNotEquals(null, retrievedCalc, 'Calculation record should be found.');
        System.assertEquals('42', retrievedCalc.Value__c, 'Retrieved value should match the expected stored value.');
    }

    @IsTest
    static void testGetCalculation_NotFound() {
        // Test retrieval when no matching record exists
        Test.startTest();
        Calculation__c retrievedCalc = CalculationController.getCalculation('999');
        Test.stopTest();

        // Validate that null is returned
        System.assertEquals(null, retrievedCalc, 'Should return null for non-existent record.');
    }
}
