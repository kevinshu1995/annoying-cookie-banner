import clsx from 'clsx';
import { BlueButton } from './../Button';

const WelcomeMessagePanel = ({ closePanel }: { closePanel: () => void }) => {
  const welcomeMessages = [
    { text: 'Hey there, welcome!', class: 'text-4xl font-bold' },
    {
      text: "How about we play a little game? If you win, I promise I won't use your cookies! 😉",
      class: 'font-bold',
    },
    {
      text: "The rules are super simple: just find that mischievous little ball in each round! You've got three precious lives, and once they're gone, it's Game Over! ",
    },
    {
      text: "But don't worry, because I'm feeling generous, I've decided to let you have infinite retries! 🤗",
    },
    {
      text: "Got it? If you're ready, just hit that start button and let's get this party started!",
    },
    {
      text: "Oh, and if you want to bail halfway through, just tap the button at the bottom of the screen to escape.But I'll be pretty disappointed if you do! 😢",
      class: 'text-gray-400',
    },
  ];

  return (
    <div className={clsx('absolute w-full h-full left-0 top-0')}>
      <div className="flex items-center justify-center bg-white/80 w-full h-full">
        <div className="space-y-4 max-w-[700px] w-full text-lg">
          {welcomeMessages.map((message, index) => (
            <p
              className={clsx(
                'animate-[fadeIn_0.5s_ease-in-out_both]',
                message?.class ?? ''
              )}
              style={{ animationDelay: `${index * 0.3}s` }}
              key={index}
            >
              {message.text}
            </p>
          ))}
          <BlueButton className="px-24 py-2" onClick={closePanel}>
            Start The Game!
          </BlueButton>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessagePanel;

