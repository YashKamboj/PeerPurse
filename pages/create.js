import { CreateContract } from '../components/CreateContract'
import { Navbar } from '../components/Navbar';
import { useNetwork } from 'wagmi';
import {address} from '../abi/addresses'

const create = () => {
  const { chain } = useNetwork();
  const contractAddress = address[chain?.name];
  
  return (
    <>
      <Navbar />
        <CreateContract contractAddress={contractAddress} />
    </>
  );
};

export default create;
