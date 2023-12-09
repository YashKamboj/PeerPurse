import { InsuranceList } from '../components/InsuranceList';

import { Navbar } from '../components/Navbar';
import { useNetwork } from 'wagmi';
import {address} from '../abi/addresses'

const list = () => {
  const { chain } = useNetwork();
  const contractAddress = address[chain?.name];
  
  return (
    <>
      <Navbar />
      <img src='https://finsfunding.com/wp-content/uploads/2018/07/AlternativeLending_FINS_Funding.png' style={{width: "100rem", maxHeight: "45rem"}} alt='Img' />
      <InsuranceList contractAddress={contractAddress} />
    </>
  );
};

export default list;
