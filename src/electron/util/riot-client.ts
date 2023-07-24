import fs from "fs";

export type RiotClientInfo = {
  name: string;
  pid: number;
  port: number;
  password: string;
  protocol: string;
}

export const getRiotClientInfo = async (): Promise<RiotClientInfo> => {
  try {
    // open %localappdata%\Riot Games\Riot Client\Config\lockfile
    const lockfilePath = `${process.env.LOCALAPPDATA}\\Riot Games\\Riot Client\\Config\\lockfile`;
    const lockfileContent = await fs.promises.readFile(lockfilePath, 'utf-8');
    const [name, pid, port, password, protocol] = lockfileContent.split(':');

    return {
      name,
      pid: parseInt(pid),
      port: parseInt(port),
      password,
      protocol
    };
  } catch (error) {
    throw new Error('Failed to read Riot Client lockfile: ' + error);
  }
};
