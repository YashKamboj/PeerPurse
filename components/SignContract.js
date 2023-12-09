import React from 'react'
import { useContractWrite } from 'wagmi'
import abi from '../abi/abi.json';
import { parseEther } from 'ethers';
import { Button, Tag } from '@ensdomains/thorin';

export const SignContract = ({ singAddress, index, contractAddress }) => {

    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: contractAddress,
        abi: abi,
        functionName: 'signContract',
    })
    const sing = singAddress != '0x0000000000000000000000000000000000000000'

    return (
        <>
            <Button
                disabled={!write || sing}
                colorStyle="purpleSecondary"
                onClick={() =>
                    write({
                        args: [`${index}`],
                        value: parseEther('0.0000002'),
                    })
                }
            >
                {sing ? 'signed' : 'Pending signature'}
            </Button>
            {isLoading && <Tag>Check Wallet</Tag>}
        </>
    )
}
