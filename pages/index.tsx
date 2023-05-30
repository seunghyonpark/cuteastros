import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link';
import styles from "../styles/Theme.module.css";

import {
  useDisconnect,
  useActiveClaimConditionForWallet,
  ConnectWallet,
  useContract,
  useUnclaimedNFTSupply,
  useClaimedNFTSupply,
  useClaimerProofs,
  useClaimIneligibilityReasons,
  useContractMetadata,
  useAddress,
  useNetwork,
  useNetworkMismatch,
  useActiveClaimCondition,
  useClaimConditions,
  Web3Button,
} from '@thirdweb-dev/react'
import { BigNumber, utils } from "ethers"

import { useEffect, useState, useMemo } from 'react'

import { parseIneligibility } from "../utils/parseIneligibility";


type ChainProps = {
  activeChainId: number;
}

const Home = (props: ChainProps) => {
  // contract initialization.
  const contractAdress = "0xa048448153712f72714c9d8A17d449E4445Ae3a7";
  const { contract: nftDrop} = useContract(contractAdress);

  const disconnect = useDisconnect();
  
  // contract metadata and supply.
  const { data: contractMetadata } = useContractMetadata(nftDrop);

  //console.log("contractMetadata", contractMetadata)

  const claimConditions = useClaimConditions(nftDrop);

  // the variable gets populated with the wallet address if connected
  const address = useAddress();
  const [quantity, setQuantity] = useState(1);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    nftDrop,
    address || ""
  );

  const claimerProofs = useClaimerProofs(nftDrop, address || "");
  
  const claimIneligibilityReasons = useClaimIneligibilityReasons(nftDrop, {
    quantity,
    walletAddress: address || "",
  });


  /*
  const { data: claimedSupply } = useClaimedNFTSupply(nftDrop);
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(nftDrop);
  */
  const unclaimedSupply = useUnclaimedNFTSupply(nftDrop);
  const claimedSupply = useClaimedNFTSupply(nftDrop);


  /*
  const { data: activeClaimCondition, isLoading, error } = useActiveClaimCondition(nftDrop);

  console.log("activeClaimCondition", activeClaimCondition);
  console.log("activeClaimCondition error", error);
  */

/*
  const { data: activeClaimCondition, isLoading, error } = useActiveClaimConditionForWallet(
    nftDrop,
    "{{wallet_address}}",
  );

  console.log("activeClaimCondition", activeClaimCondition);
  console.log("activeClaimCondition error", error);

*/

  
  const maxClaim: string = activeClaimCondition?.quantityLimitPerTransaction !== undefined ? activeClaimCondition?.quantityLimitPerTransaction: '0';
  
  // to check if all nfts are sold out.
  /*
  const isSoldOut = unclaimedSupply?.toNumber() === 0;
    */

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0)
      .add(BigNumber.from(unclaimedSupply.data || 0))
      .toString();
  }, [claimedSupply.data, unclaimedSupply.data]);

  const priceToMint = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0
    );
    return `${utils.formatUnits(
      bnPrice.mul(quantity).toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
    quantity,
  ]);



  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      bnMaxClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimableSupply || 0
      );
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimablePerWallet || 0
      );
    } catch (e) {
      perTransactionClaimable = BigNumber.from(1_000_000);
    }

    if (perTransactionClaimable.lte(bnMaxClaimable)) {
      bnMaxClaimable = perTransactionClaimable;
    }

    const snapshotClaimable = claimerProofs.data?.maxClaimable;

    if (snapshotClaimable) {
      if (snapshotClaimable === "0") {
        // allowed unlimited for the snapshot
        bnMaxClaimable = BigNumber.from(1_000_000);
      } else {
        try {
          bnMaxClaimable = BigNumber.from(snapshotClaimable);
        } catch (e) {
          // fall back to default case
        }
      }
    }

    const maxAvailable = BigNumber.from(unclaimedSupply.data || 0);

    let max;
    if (maxAvailable.lt(bnMaxClaimable)) {
      max = maxAvailable;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000)) {
      return 1_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    unclaimedSupply.data,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    try {
      return (
        (activeClaimCondition.isSuccess &&
          BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
            0
          )) ||
        numberClaimed === numberTotal
      );
    } catch (e) {
      return false;
    }
  }, [
    activeClaimCondition.data?.availableSupply,
    activeClaimCondition.isSuccess,
    numberClaimed,
    numberTotal,
  ]);



  const canClaim = useMemo(() => {
    return (
      activeClaimCondition.isSuccess &&
      claimIneligibilityReasons.isSuccess &&
      claimIneligibilityReasons.data?.length === 0 &&
      !isSoldOut
    );
  }, [
    activeClaimCondition.isSuccess,
    claimIneligibilityReasons.data?.length,
    claimIneligibilityReasons.isSuccess,
    isSoldOut,
  ]);

  const isLoading = useMemo(() => {
    return (
      activeClaimCondition.isLoading ||
      unclaimedSupply.isLoading ||
      claimedSupply.isLoading ||
      !nftDrop
    );
  }, [
    activeClaimCondition.isLoading,
    nftDrop,
    claimedSupply.isLoading,
    unclaimedSupply.isLoading,
  ]);


  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading]
  );
  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return "Sold Out";
    }

    
    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0
      );
      if (pricePerToken.eq(0)) {
        return "Mint (Free)";
      }
      return `Mint (${priceToMint})`;
    }
    if (claimIneligibilityReasons.data?.length) {
      return parseIneligibility(claimIneligibilityReasons.data, quantity);
    }
    if (buttonLoading) {
      return "Checking eligibility...";
    }

    return "Claiming not available";
  }, [
    isSoldOut,
    canClaim,
    claimIneligibilityReasons.data,
    buttonLoading,
    activeClaimCondition.data?.currencyMetadata.value,
    priceToMint,
    quantity,
  ]);






  // checks if the user is on an wrong network
  const isWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  // sucess and error messages
  const [succes, setSucces] = useState("");
  const [errormsg, setError] = useState("");

  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    console.log(maxClaim);
  }, [maxClaim])

  // the qty variable gets populated with the qty which user enters
  const [qty, setQty] = useState(1);



  // mint function
  const mint = async () => {
    setError('');
    setSucces('');

    if (!address){
      setError("Please connect your wallet.")
      return;
    }

    if (isWrongNetwork){
      switchNetwork && switchNetwork(props.activeChainId);
      return;
    }

    if (qty < 1){
      setError(`Min 1 required.`);
      return;
    }
    
    if (qty > Number(maxClaim)){
      setError(`Max ${maxClaim} allowed`);
      return;
    }

    setIsMinting(true);

    try {
      await nftDrop?.erc721.claim(qty);
      setIsMinting(false);
      setSucces('Mint successful 🥳');
      setQty(1);
    } catch (error: any) {
      // console.log(qty);
      setIsMinting(false);
      setQty(1);
      setError(error.reason);
  }

  }

  // to display the loader until the data is fetched
  if (!nftDrop || !contractMetadata){
    return (
      <div className="pre__loader w-full min-h-screen flex items-center justify-center">
        <div className='p-4 rounded-lg bg-[#ffffffd6]'>
          <span className="loader"></span>
        </div>
      </div>
    )
  }



  return (
  


      <div className={styles.container}>

      <div className={styles.mintInfoContainer}>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>


            <div className={styles.mintContainer}>
              {isSoldOut ? (
                <div>
                  <h2>Sold Out</h2>
                </div>
              ) : (

                
                <button onClick={disconnect}>Disconnect</button>

                /*
                <Web3Button
                  contractAddress={nftDrop?.getAddress() || ""}
                  action={(cntr) => cntr.erc721.claim(quantity)}
                  isDisabled={!canClaim || buttonLoading}
                  onError={(err) => {
                    console.error(err);
                    console.log("err", err);
                    alert("Error claiming NFTs");
                  }}
                  onSuccess={() => {
                    setQuantity(1);

                    console.log("Successfully claimed NFTs");
                    alert("Successfully claimed NFTs");
                  }}
                >
                  {buttonLoading ? "Loading..." : buttonText}
                </Web3Button>

                */


              )}
            </div>


            <div className={styles.infoSide}>
              {/* Title of your NFT Collection */}
              <h1>{contractMetadata?.name}</h1>
              {/* Description of your NFT Collection */}
              <p className={styles.description}>
                {contractMetadata?.description}
              </p>
            </div>

            <div className={styles.imageSide}>
              {/* Image Preview of NFTs */}
              <Image
                width={500}
                height={500}
                className={styles.image}
                src={contractMetadata?.image}
                alt={`${contractMetadata?.name} preview image`}
              />

              {/* Amount claimed so far */}
              <div className={styles.mintCompletionArea}>
                <div className={styles.mintAreaLeft}>
                  <p>Total Minted</p>
                </div>
                <div className={styles.mintAreaRight}>
                  {claimedSupply && unclaimedSupply ? (
                    <p>
                      <b>{numberClaimed}</b>
                      {" / "}
                      {numberTotal}
                    </p>
                  ) : (
                    // Show loading state if we're still loading the supply
                    <p>Loading...</p>
                  )}
                </div>
              </div>

              {claimConditions.data?.length === 0 ||
              claimConditions.data?.every(
                (cc) => cc.maxClaimableSupply === "0"
              ) ? (
                <div>
                  <h2>
                    This drop is not ready to be minted yet. (No claim condition set)
                  </h2>
                </div>
              ) : (


                

                <div className='border '>
                  <p>Quantity</p>
                  <div className="flex flex-row items-center justify-center gap-3 ">
                    <button
                      className={`${styles.quantityControlButton}`}
                      onClick={() => setQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>

                    <h1>{quantity}</h1>

                    <button
                      className={`${styles.quantityControlButton}`}
                      onClick={() => setQuantity(quantity + 1)}

                      disabled={quantity >= maxClaimable}
                      //disabled={true}

                    >
                      +
                    </button>
                  </div>

                  <div className={styles.mintContainer}>
                    {isSoldOut ? (
                      <div>
                        <h2>Sold Out</h2>
                      </div>
                    ) : (
                      <Web3Button
                        contractAddress={nftDrop?.getAddress() || ""}
                        action={(cntr) => cntr.erc721.claim(quantity)}
                        isDisabled={!canClaim || buttonLoading}
                        onError={(err) => {
                          console.error(err);
                          console.log("err", err);
                          alert("Error claiming NFTs");
                        }}
                        onSuccess={() => {
                          setQuantity(1);

                          console.log("Successfully claimed NFTs");
                          alert("Successfully claimed NFTs");
                        }}
                      >
                        {buttonLoading ? "Loading..." : buttonText}
                      </Web3Button>
                    )}

                    <div>

{/*
                    <Link href={"https://opensea.io/collection/vienna-mania"} className="w-64 h-16 bg-gradient-to-r from-[#08FF08] to-[#008013] rounded-lg flex items-center justify-center">
                      <span className="text-gray-200 text-2xl ">OpenSea</span>
                    </Link>
                      */}
                    </div>

                  </div>
                </div>


              )}

            </div>
          </>
        )}

      </div>

      {/* Powered by thirdweb */}{" "}
      {/*
      <img
        src="/logo.png"
        alt="thirdweb Logo"
        width={135}
        className={styles.buttonGapTop}
      />
      */}

      {/*
      <Image
        src="/logo.png"
        alt="logo image"
        width={500}
        height={500}
      />
      */}

      </div>




    
  )
}

export default Home


    {/*
        <div className='flex justify-center items-center'>


          <div className="mint__card w-[20rem] min-h-[25rem] rounded-lg p-4">
            <div className="card__top flex justify-between items-center">
              <h2 className='heading text-xl'> {contractMetadata.name} 🚀 </h2>
              <span>{claimedSupply?.toNumber()}/{""}{(unclaimedSupply?.toNumber() || 0) + (claimedSupply?.toNumber() || 0)}</span>
            </div>
            <div className="card__img mt-3">
              <Image src="/card.png" alt="granderby" className='rounded-lg' layout='responsive' width='100%' height='100%' priority={true} />
            </div>
            <div className="card__btn mt-3">
              {address ? (
                <div className="mint__options flex justify-centre items-centre gap-x-2">
                  <input type="number" placeholder='QTY' name="qty" className="border text-sm rounded-md block w-[30%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" disabled={isMinting} min="1" max={maxClaim} onChange={(e) => {setQty(Number(e.target.value))}} />

                  <button onClick={mint} disabled={isMinting} className='p-2 bg-[#843cff] rounded-md w-[70%] text-white heading'>{isMinting? 'Minting' : isWrongNetwork? 'Change network' : 'Mint 🚀'}</button>
                </div>
              ) : (<ConnectWallet accentColor="#843cff" colorMode='light'/>)}


              <span className="loader-mint"></span>
            </div>
          </div>
  
        </div>




        {succes? (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg fixed bottom-0 right-4" role="alert">
            <span className="font-medium">{succes}</span>
          </div>
        ) 
        : 
        errormsg? (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg fixed bottom-0 right-4" role="alert">
            <span className="font-medium"> {errormsg} </span>
          </div>
        ) : <></>}

      */}
