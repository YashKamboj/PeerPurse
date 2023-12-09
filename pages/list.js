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
      <InsuranceList contractAddress={contractAddress} />
    </>
  );
};

export default list;
