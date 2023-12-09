// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Loans {
    enum PaymentStatus {
        Pending,
        Paid,
        Debtor
    }

    struct Insurance {
        address tenantAddress;
        address ownerAddress;
        uint256 monthlyRentalAmount;
        uint256 dueDate1;
        uint256 dueDate2;
        uint256 paymentDeadline3;
        PaymentStatus paymentStatus1;
        PaymentStatus paymentStatus2;
        PaymentStatus paymentStatus3;
        uint256 insuranceEndDate;
        uint256 deposit;
    }

    mapping(uint256 => Insurance) public insurances;
    uint256 public insuranceCounter = 0;

    constructor() {}

    function createInsurance(uint256 _monthlyRentalAmount) external {
        require(
            msg.sender != address(0),
            "Owner must be a valid address."
        );

        Insurance memory newInsurance;
        newInsurance.tenantAddress = address(0); // Tenant will be set later
        newInsurance.ownerAddress = msg.sender;
        newInsurance.monthlyRentalAmount = _monthlyRentalAmount;
        newInsurance.dueDate1 = block.timestamp + 30 days; // First payment due in 30 days
        newInsurance.dueDate2 = newInsurance.dueDate1 + 30 days;
        newInsurance.paymentDeadline3 = newInsurance.dueDate2 + 30 days;
        newInsurance.paymentStatus1 = PaymentStatus.Pending;
        newInsurance.paymentStatus2 = PaymentStatus.Pending;
        newInsurance.paymentStatus3 = PaymentStatus.Pending;
        newInsurance.insuranceEndDate = newInsurance.paymentDeadline3 + 5 days; // Change in insurance end date
        newInsurance.deposit = _monthlyRentalAmount;

        insurances[insuranceCounter] = newInsurance;
        insuranceCounter++;
    }

    function signContract(uint256 _insuranceId) external payable {
        require(_insuranceId <= insuranceCounter, "Insurance does not exist");
        Insurance storage insurance = insurances[_insuranceId];

        require(
            msg.sender != address(0),
            "Tenant must be a valid address"
        );
        require(
            msg.sender != insurance.ownerAddress,
            "Owner cannot be the tenant"
        );
        require(
            insurance.tenantAddress == address(0),
            "Insurance has already been signed by a tenant"
        );
        require(
            msg.value == insurance.monthlyRentalAmount + insurance.deposit,
            "Must pay the deposit equal to the monthly rental amount"
        );

        insurance.tenantAddress = msg.sender;
        insurance.paymentStatus1 = PaymentStatus.Paid; // Mark the first payment as Paid
    }

    function payRent(uint256 _insuranceIndex) external payable {
        require(_insuranceIndex <= insuranceCounter, "Insurance does not exist");
        Insurance storage insurance = insurances[_insuranceIndex];

        uint256 pendingAmount;
        uint256 paymentDeadline;

        if (insurance.paymentStatus2 == PaymentStatus.Pending) {
            pendingAmount = insurance.monthlyRentalAmount;
            paymentDeadline = insurance.dueDate2;
        } else if (insurance.paymentStatus3 == PaymentStatus.Pending) {
            pendingAmount = insurance.monthlyRentalAmount;
            paymentDeadline = insurance.paymentDeadline3;
        }
        require(
            block.timestamp <= paymentDeadline,
            "The deadline to make the payment has expired."
        );

        if (pendingAmount > 0) {
            require(
                msg.value >= pendingAmount,
                "The paid amount is not sufficient."
            );

            if (insurance.paymentStatus2 == PaymentStatus.Pending) {
                insurance.paymentStatus2 = PaymentStatus.Paid;
            } else if (insurance.paymentStatus3 == PaymentStatus.Pending) {
                insurance.paymentStatus3 = PaymentStatus.Paid;
            }
        }
    }

    function executeInsurance(uint256 _insuranceIndex) external {
        require(_insuranceIndex <= insuranceCounter, "Insurance does not exist");
        Insurance storage insurance = insurances[_insuranceIndex];
        require(
            msg.sender == insurance.ownerAddress,
            "Only the owner can execute the insurance."
        );

        require(
            insurance.paymentStatus1 == PaymentStatus.Debtor,
            "Insurance cannot be executed."
        );

        uint256 currentPaymentDate;

        if (insurance.paymentStatus1 == PaymentStatus.Pending) {
            currentPaymentDate = insurance.dueDate1;
        } else if (insurance.paymentStatus2 == PaymentStatus.Pending) {
            currentPaymentDate = insurance.dueDate2;
        } else if (insurance.paymentStatus3 == PaymentStatus.Pending) {
            currentPaymentDate = insurance.paymentDeadline3;
        }

        require(
            block.timestamp > currentPaymentDate + 1 days,
            "Not enough time has passed since the payment date."
        );

        uint256 redemptionAmount = insurance.monthlyRentalAmount +
            (insurance.monthlyRentalAmount / 3);
        insurance.deposit -= redemptionAmount;
        insurance.insuranceEndDate = block.timestamp;
        payable(msg.sender).transfer(redemptionAmount);
    }

    function endContract(uint256 _insuranceIndex) external {
        require(_insuranceIndex <= insuranceCounter, "Insurance does not exist");
        Insurance storage insurance = insurances[_insuranceIndex];
        require(
            msg.sender == insurance.tenantAddress,
            "Only the tenant can end the contract."
        );

        require(
            insurance.paymentStatus1 == PaymentStatus.Paid &&
                insurance.paymentStatus2 == PaymentStatus.Paid &&
                insurance.paymentStatus3 == PaymentStatus.Paid,
            "Not all payments have been made on time."
        );

        uint256 totalDepositedAmount = insurance.deposit;
        insurance.deposit = 0;
        insurance.insuranceEndDate = block.timestamp;

        payable(msg.sender).transfer(totalDepositedAmount);
    }

    function getInsurances() public view returns (Insurance[] memory) {
        Insurance[] memory insuranceArray = new Insurance[](insuranceCounter);

        for (uint256 i = 0; i < insuranceCounter; i++) {
            insuranceArray[i] = insurances[i];
        }

        return insuranceArray;
    }
}