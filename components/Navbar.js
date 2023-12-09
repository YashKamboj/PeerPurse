import { HStack, Link, Box, Text, Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState ,useEffect } from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";

export const Navbar = () => {
  const isBrowser = typeof window !== "undefined";
  const [inboxNotifications, setInboxNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const initializeUser = async () => {
    try {
      const signer = new ethers.Wallet('e392d9c845d8d286b573c261ee9a1606beb82534faad330746e2078237383b9e')

      const userAlice = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });

      // List inbox notifications
      const inboxNotifications = await userAlice.notification.list("INBOX");
      setInboxNotifications(inboxNotifications);
      console.log(inboxNotifications)

      const pushChannelAdress = "0xfa7DAd30cEC36F38c124dA6bCD6DB884EA8d78d4";

      const aliceSubscriptions = await userAlice.notification.subscriptions();
      

      // Subscribe to push channel
      await userAlice.notification.subscribe(
        `eip155:11155111:${pushChannelAdress}` // channel address in CAIP format
      );

      const stream = await userAlice.initStream([CONSTANTS.STREAM.NOTIF]);

      // Set stream event handling
      stream.on(CONSTANTS.STREAM.NOTIF, (data) => {
        console.log(data);
      });

      // Connect to stream
      stream.connect();
    } catch (error) {
      console.error("Error creating :", error);
    }
  };

  
  useEffect(() => {
    initializeUser();
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };


  return (
    <Box bg="rgba(255, 255, 255, 0.8)" p={4} borderRadius={16} position={"absolute"} marginTop={"2rem"}>
      <HStack spacing={12} justify="space-between">
        <Link
          href="/"
          color="#344767"
          fontSize="2rem"
          fontWeight="bold"
          _hover={{ textDecoration: "none" }}
        >
          PeerPurse
        </Link>
        <HStack spacing={8}>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/create">Create Contract</NavLink>
          <NavLink href="/list">Contract List</NavLink>
          <Button onClick={toggleNotifications} color="black">
            Notifications
          </Button>
          {showNotifications && (
            <NotificationsPopup notifications={inboxNotifications} />
          )}
        </HStack>

        {isBrowser && window.ethereum && window.ethereum.isMiniPay ? (
          <div />
        ) : (
          <ConnectButton />
        )}
      </HStack>
    </Box>
  );
};

const NavLink = ({ href, children }) => (
  <Link
    href={href}
    color="#344767"
    fontSize="large"
    _hover={{ textDecoration: "underline" }}
  >
    {children}
  </Link>
);

const NotificationsPopup = ({ notifications }) => (
  <Box
    position="absolute"
    top="4.5rem"
    width='20rem'
   marginLeft='23rem'
   bg="#1a202c"
    p={4}
    boxShadow="md"
    borderRadius="md"
    border="1px solid #33404d"
  >
    {/* <Text fontWeight="bold" mb={2}>
      Notifications
    </Text> */}
    {notifications.map((notification, index) => (
      <Box
      key={index}
      p={3}
      mb={2}
      bg="#33404d"
      borderRadius="md"
      boxShadow="sm"
    >
      <Text key={index}>{notification.message}</Text>
      </Box>
    ))}
  </Box>
);