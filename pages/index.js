import { CreateContract } from '../components/CreateContract'
import { InsuranceList } from '../components/InsuranceList';
import { Navbar } from '../components/Navbar';
import { useNetwork } from 'wagmi';
import {address} from '../abi/addresses'
import {Img} from "../bgImg1.jpeg"
import "../components/bgImg1.jpeg"

const Home = () => {
  const { chain } = useNetwork();
  const contractAddress = address[chain?.name];
  
  return (
    <>
      <Navbar />
      <img src='https://scalenut.s3.dualstack.us-east-2.amazonaws.com/4207e6d8-9c08-42d2-81fd-815611dcebcd.jpeg' style={{width: "100rem", maxHeight: "45rem"}} alt='Img' />
        <CreateContract contractAddress={contractAddress} />
        <hr style={{border: "1px solid white", width: "100%"}} />
        <InsuranceList contractAddress={contractAddress} />
    </>
  );
};

export default Home;
