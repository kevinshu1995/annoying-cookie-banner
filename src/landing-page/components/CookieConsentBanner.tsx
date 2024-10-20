import { useState, useEffect } from 'react';
import { cn } from '../cn';
import CupGameCanvas from './cupGame/CupGameCanvas';
import { Button, BlueButton, GrayButton } from './Button';

function theWorstFunction() {
  alert("Okay, I won't try to use cookies (wink).");
}

const MovingCookieConsentBanner = () => {
  const [isShowingModal, setIsShowingModal] = useState(false);

  const closeModal = () => {
    setIsShowingModal(false);
  };

  function onAccept() {
    alert('Of course you accept 😈😈😈.');
  }

  function onRefuse() {
    setIsShowingModal(true);
  }

  return (
    <div>
      <MiniGameModal isShowing={isShowingModal} closeModal={closeModal} />
      <div
        className={cn(
          'fixed bottom-0 left-0 w-full bg-blue-500 text-white p-4 flex justify-between items-end gap-4'
        )}
      >
        <div>
          <p className="font-bold">This website uses cookies</p>
          <p>
            We use cookies to ensure you get the best experience on our website.
          </p>
        </div>
        <div className="flex gap-x-2">
          <Button
            className="relative text-white/30 border border-white/30 px-4 py-2"
            onClick={onRefuse}
          >
            No
          </Button>
          <Button
            className="bg-white hover:bg-white/90 text-blue-500 border px-4 py-2"
            onClick={onAccept}
          >
            Accept
          </Button>
        </div>
      </div>
      {/* <div id='cookieconsent'></div> */}
    </div>
  );
};

function MiniGameModal({ isShowing = false, closeModal = () => {} }) {
  const [modalStep, setModalStep] = useState(0);
  const nextStep = () => setModalStep(modalStep + 1);

  useEffect(() => {
    setModalStep(0);
  }, [isShowing]);

  const closeModalAndAccept = () => {
    theWorstFunction();
    closeModal();
  };

  return (
    <div
      className={cn(
        'fixed z-99 left-0 top-0 w-full h-full text-gray-800',
        isShowing ? 'block' : 'hidden'
      )}
    >
      {/* backdrop */}
      <div className="bg-white/50 backdrop-blur w-full h-full flex items-center justify-center">
        {/* content */}
        {modalStep === 0 && (
          <div className="w-full max-w-[800px] p-4 md:p-8">
            <ModalBodyBeforeGame nextStep={nextStep} />
          </div>
        )}
        {modalStep === 1 && (
          <div className="w-full">
            <CupGameCanvas closeModal={closeModal} />
          </div>
        )}
        {modalStep > 0 && (
          <div className="absolute w-full right-0 bottom-0 flex items-center justify-center gap-2 bg-white/50 p-3 border-t border-t-gray-200">
            <p>
              you can end this test at any time and agree to let us use Cookies.
            </p>
            <BlueButton
              className="px-4 py-2 text-nowrap"
              onClick={closeModalAndAccept}
            >
              End this test
            </BlueButton>
          </div>
        )}
      </div>
    </div>
  );
}

function ModalBodyBeforeGame({ nextStep = () => {} }) {
  const defaultOkButtonWidth = 120;
  const [okButtonWidth, setOkButtonWidth] = useState(defaultOkButtonWidth);

  function onMouseEnterNoButton() {
    setOkButtonWidth(248);
  }

  function onMouseLeaveOkButton() {
    setOkButtonWidth(defaultOkButtonWidth);
  }
  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold">ARE YOU SURE?</h2>
      </header>
      <main className="space-y-2 text-gray-700 text-sm">
        <p>OK. Before you refuse, we want to give you a simple little test.</p>
        <p>
          We just want to make sure you don't really want to refuse, because we
          truly care about your feelings.
        </p>
        <p className="font-bold">
          In the test, you can change your mind at any time and agree to let us
          use Cookies.
        </p>
      </main>
      <footer className="flex justify-end gap-x-2">
        <GrayButton
          className="w-30 px-4 py-2"
          onMouseEnter={onMouseEnterNoButton}
          onClick={theWorstFunction}
        >
          No
        </GrayButton>
        <div
          className="relative w-30"
          style={{ width: `${defaultOkButtonWidth}px` }}
          onMouseLeave={onMouseLeaveOkButton}
        >
          <BlueButton
            style={{ width: `${okButtonWidth}px` }}
            className="absolute right-0 top-0 px-4 py-2 duration-100"
            onClick={nextStep}
          >
            Absolutely
          </BlueButton>
        </div>
      </footer>
    </div>
  );
}

export default MovingCookieConsentBanner;

