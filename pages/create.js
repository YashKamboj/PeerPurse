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
      <img src='https://www.debt.org/wp-content/uploads/2018/09/Peer-to-peer-Lending.png' style={{width: "100rem", maxHeight: "45rem"}} alt='Img' />
        <CreateContract contractAddress={contractAddress} />
    </>
  );
};

export default create;
