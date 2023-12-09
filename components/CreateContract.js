import React, { useState } from 'react';
import { useContractWrite } from 'wagmi';
import abi from '../abi/abi.json';
import { parseEther, ethers } from 'ethers';
import { Stack, Input, Button, Typography } from '@chakra-ui/react';
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
// import { ethers } from "ethers";

export const CreateContract = ({ contractAddress }) => {
  const [borrower, setBorrower] = useState('');
  const [loanAmount, setLoanAmount] = useState('1');
  const [numInstallments, setNumInstallments] = useState('');

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: '0x6eA5f433495fbc04C65aF98A1c3e68Cb20f282C5',
    abi: abi,
    functionName: 'createLoanAgreement',
    args: [borrower, loanAmount, numInstallments]
  });

  const handleSomething = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);


    const signer_details = provider.getSigner();

    console.log(signer_details)
  }

  const handleSuccess = async() => {
    const signer = new ethers.Wallet('e392d9c845d8d286b573c261ee9a1606beb82534faad330746e2078237383b9e')


    const userAlice = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });

    const pushChannelAdress = "0xfa7DAd30cEC36F38c124dA6bCD6DB884EA8d78d4";


    await userAlice.notification.subscribe(
      `eip155:11155111:${pushChannelAdress}` // channel address in CAIP format
    );

       await userAlice.channel.send([borrower], {
        notification: {
          title: "New Contract Created",
          body: `${borrower} Borrowed ${loanAmount} `,
        },
      });

      const inboxNotifications = await userAlice.notification.list("INBOX");
      console.log(JSON.stringify(inboxNotifications) )

      const stream = await userAlice.initStream([CONSTANTS.STREAM.NOTIF]);

      // Set stream event handling
      stream.on(CONSTANTS.STREAM.NOTIF, (data) => {
        console.log(data);
      });

      // Connect to stream
      stream.connect();

    // const stream = await userAlice.initStream([CONSTANTS.STREAM.NOTIF]);

    // stream.on(CONSTANTS.STREAM.NOTIF, (data) => {
    //   console.log(data);
    // });

    // // Connect to stream
    // stream.connect();
  };
  

  return (
    <>
    <Stack border={'1px white #fff '} borderColor={'#fff'} padding={5} margin={5} width={1230} borderRadius={'2xl'}>
      <h1 style={{fontSize:"3rem", marginBottom:"1rem", color: "#2596be"}}>Create Contract</h1>
    <p><b>Borrower's Address:</b></p>  <Input
        value={borrower}
        onChange={(e) => setBorrower(e.target.value)}
        description="Enter the address of the borrower"
        label="Borrower Address"
        placeholder="0x..."
      />
      <p><b>Amount:</b></p> <Input
        type="number"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
        description="Enter the loan amount"
        label="Loan Amount"
        placeholder="100"
      />
      <p><b>No. of Installments:</b></p> <Input
        type="number"
        value={numInstallments}
        onChange={(e) => setNumInstallments(e.target.value)}
        description="Enter the number of installments"
        label="Number of Installments"
        placeholder="12"
      />
      {/* <Button colorScheme="indigo" onClick={() => write()}>
        Create Loan Agreement
      </Button> */}
      <button  onClick={() => handleSuccess()} style={styles.paymentButton} >Create Loan Agreement</button>
      {isLoading && <div>Transaction in progress...</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)} {handleSuccess()}</div>}
    </Stack>
    </>
  );
};


const styles = {
  paymentButton: {
    marginTop: '10px',
    background: '#0d76fc',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: "2rem"
  },
};
