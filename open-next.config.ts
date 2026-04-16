type OpenNextCloudflareConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node";
    };
  };
};

const config = {
  default: {
    override: {
      wrapper: "cloudflare-node"
    }
  }
} satisfies OpenNextCloudflareConfig;

export default config;
