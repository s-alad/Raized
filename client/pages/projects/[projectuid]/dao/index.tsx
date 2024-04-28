import React from "react";
import { FormEvent, useEffect, useState } from "react";
import Gun from "gun";
import s from "./dao.module.scss";
import { useRouter } from "next/router";
import { useAuth } from "@/authentication/authcontext";
import { StacksDevnet, StacksMainnet } from "@stacks/network";
import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { AnchorMode, PostConditionMode, stringUtf8CV } from '@stacks/transactions';
import { bufferCVFromString, callReadOnlyFunction } from '@stacks/transactions';

type Message = {
  text: string;
  id: string;
  sender: string;
  createdAt?: number;
};

export default function Projects() {
  const router = useRouter();
  const { projectuid } = router.query;
  const [frozen, setFrozen] = useState(false);
  const gun = Gun(['https://gun-manhattan.herokuapp.com/gun']);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { raiser } = useAuth();
  const userId = raiser?.stacksaddress;
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (fetched) return;
      if (projectuid) {
        const messageIds = new Set<string>();

        const chatRef = gun.get(`chats/${projectuid}`);
        chatRef.map().once((message: any, id: string) => {
          if (!messageIds.has(id)) {
            messageIds.add(id);
            setMessages((prevMessages) => [...prevMessages, { ...message, id }]);
            setFetched(true);
          }
        });

        return () => {
          chatRef.off();
        };
      }
    };

    fetchMessages();
  }, [projectuid]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (message.trim() && projectuid) {
      const chatRef = gun.get(`chats/${projectuid}`);
      const newMessage = {
        text: message,
        sender: userId,
        createdAt: Gun.state(),
      };
      chatRef.set(newMessage, (ack) => {
        setMessage('');
      });
    }
  };

  async function freeze() {
    openContractCall({
      network: new StacksMainnet(),
      anchorMode: AnchorMode.Any, // which type of block the tx should be mined in

      contractAddress: 'SP194138VA57FKR364CBH0DZBCXT7RS4BJEQZ8SP3',
      contractName: 'Campaign',
      functionName: 'vote-to-freeze',
      functionArgs: [],

      postConditionMode: PostConditionMode.Deny, // whether the tx should fail when unexpected assets are transferred
      postConditions: [], // for an example using post-conditions, see next example

      onFinish: response => {
        router.reload();
      },
      onCancel: () => {
        // WHEN user cancels/closes pop-up
      },
    });
  }

  async function read() {
    const contractAddress = 'SP194138VA57FKR364CBH0DZBCXT7RS4BJEQZ8SP3';
    const contractName = 'Campaign';
    const functionName = 'read-num-frozen-votes';
    const network = new StacksMainnet();
    const senderAddress = raiser!.stacksaddress as string;

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs: [],
      network,
      senderAddress,
    };

    const result = await callReadOnlyFunction(options);;
    console.log(result);
  }

  useEffect(() => {
    read();
  }, []);

  return (
    <>
      {frozen ? (
        <p>freeze</p>
      ) : (
        <div className={s.main}>
          <div className={s.chat}>
            <h1>Chat</h1>
            <div className={s.messages}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`${s.message} ${m.sender === userId ? s.userMessage : s.otherMessage}`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className={s.input}>
              <form onSubmit={handleSubmit} className={s.input}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">↑</button>
              </form>
            </div>
          </div>
          <div className={s.milestones}>
            <h1>Milestone Submissions</h1>
            <p>no submissions currently</p>
          </div>
          <div className={s.voteFreeze}>
            <h1>Number of votes left to freeze</h1>
            <p>{5 - 0} / 5</p>
            <button
              onClick={freeze}
            >Freeze Project</button>
          </div>
        </div>
      )}
    </>
  );
}