import React from 'react';
import { Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const config = {
  title: <div className="text-orange-400">Info</div>,
  icon: <InfoCircleOutlined style={{ color: '#FB923C' }} />,

  content: (
    <>
      <p>1. Enter the number of searches (Max: 50 in single search). </p>
      <p>
        2. The query will be randomly generated and searched randomly between
        the 5s to 10s interval.
      </p>
      <p>3. The searches will be opened in new tabs. </p>
      <p>4. You can stop searching while searching</p>
      <p>5. You can close all the tabs at once </p>
    </>
  ),
};

const ModalContainer: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();

  return (
    <>
      <div
        onClick={async () => {
          modal.info({
            maskClosable: true,
            ...config,
            footer: null,
            closable: true,
          });
        }}
        className="text-orange-300 cursor-pointer hover:text-orange-400"
      >
        Instruction
      </div>
      {contextHolder}
    </>
  );
};

export default ModalContainer;
