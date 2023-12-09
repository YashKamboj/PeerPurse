import React, { useState, useEffect } from 'react';
import { useContractRead, useContractWrite } from 'wagmi';
import abi from '../abi/abi.json';
import { Button } from '@chakra-ui/react';

export const InsuranceList = ({ contractAddress }) => {
  const [loanList, setLoanList] = useState([]);
  const [id, setId] = useState(0);

  const { data: getLoanAgreements, isLoading, isError } = useContractRead({
    address: '0x6eA5f433495fbc04C65aF98A1c3e68Cb20f282C5',
    abi: abi,
    functionName: 'getLoanAgreements',
  });

  useEffect(() => {
    if (getLoanAgreements) {
      setLoanList(getLoanAgreements);
      console.log(getLoanAgreements)
    }
  }, [getLoanAgreements]);

  const { write, isLoading: isPaymentLoading, isSuccess } = useContractWrite({
    address: '0x6eA5f433495fbc04C65aF98A1c3e68Cb20f282C5',
    abi: abi,
    functionName: 'makePayment',
  });

  const handleMakePayment = async (agreementId) => {
    try {
      if (getLoanAgreements) {
        const selectedAgreement = getLoanAgreements[agreementId];
        const paymentAmount = selectedAgreement.installmentAmount;
        setId(paymentAmount);

        console.log(paymentAmount + "payment amount")
        await write({
          args: [agreementId],
        });

      } else {
        console.error('getLoanAgreements is undefined');
      }
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toLocaleString(); // Use appropriate locale and options
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading} >Contract List</h1>
      <div style={styles.cardContainer}>
        {loanList.length > 0 ? (
          loanList.map((data, index) => (
            <div key={index} style={styles.card}>
              <p><b>Borrower's Address: </b>{data.borrower}</p>
              <p><b>Lender's Address: </b>{data.lender}</p>
              <p><b>Amount: </b>{Number(data.loanAmount)}</p>
              <p><b>Number of installments: </b>{Number(data.numInstallments)}</p>
              <p><b>Date of transaction: </b>{formatTimestamp(Number(data.loanStartDate))}</p>
              <p><b>Next Due Date: </b>{formatTimestamp(Number(data.nextDueDate))}</p>
              <button onClick={() => handleMakePayment(index)} style={styles.paymentButton}>
                Make Payment
              </button>
            </div>
          ))
        ) : (
          <p>No loan agreements available</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {justifyContent: 'center',
  padding: '2rem 12rem',

  
  
},
heading: {
  marginLeft: "1rem",
  fontSize:"3rem",
  color: "#2596be",
  marginBottom:"3rem"
  },
  
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px', // Add gap between cards
    justifyContent: 'center', // Center the cards horizontally
  },
  card: {
    margin: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow to each card
    minWidth: '200px', // Set a minimum width for each card
  },
  paymentButton: {
    marginTop: '10px',
    background: '#0d76fc',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
