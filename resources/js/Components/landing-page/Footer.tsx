import ApplicationLogo from "../ApplicationLogo";

export const Footer = () => {
  return (
    <footer className="container relative border-t py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Logo column */}
        <div className="flex flex-col gap-2">
          <a href="/" className="flex items-center gap-2">
            <ApplicationLogo variant="circular" className="h-8 w-8" />
            <span className="font-semibold">TeamSync</span>
          </a>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Follow US</h3>
            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Github
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Twitter
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Dribbble
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Platforms</h3>
            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Web
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Mobile
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Desktop
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">About</h3>
            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Features
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Pricing
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                FAQ
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Community</h3>
            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Youtube
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Discord
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Twitch
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
