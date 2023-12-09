import { CreateContract } from '../components/CreateContract'
import { InsuranceList } from '../components/InsuranceList';
import { Navbar } from '../components/Navbar';
import { useNetwork } from 'wagmi';
import {address} from '../abi/addresses'
const Home = () => {
  const { chain } = useNetwork();
  const contractAddress = address[chain?.name];
  
  return (
    <>
      <Navbar />
        <CreateContract contractAddress={contractAddress} />
        <hr />
        <InsuranceList contractAddress={contractAddress} />
    </>
  );
};

export default Home;
