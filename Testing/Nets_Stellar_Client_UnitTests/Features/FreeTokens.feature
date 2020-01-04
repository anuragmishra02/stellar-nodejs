Feature: Test
    
    @APITest2
  Scenario: Free tokens with Valid Parameters
    Given I send a Request with Valid Input
   Then  I get Response For Valid Input
    
     @APITest2
  Scenario: Free tokens with Invalid Parameters
    Given I send a Request with Invalid Input
   Then  I get Response For Invalid Input
    