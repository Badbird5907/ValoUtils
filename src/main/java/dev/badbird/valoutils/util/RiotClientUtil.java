package dev.badbird.valoutils.util;

import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

public class RiotClientUtil {
    private static final File LOCKFILE = new File(System.getenv("LOCALAPPDATA") + "/Riot Games/Riot Client/Config/lockfile");

    public static record RiotClient(String name, int pid, int port, String password, String protocol) {
        private static RiotClient cached;
        private static long lastModified;

        public static RiotClient fromString(String s) {
            String[] split = s.split(":");
            return new RiotClient(split[0], Integer.parseInt(split[1]), Integer.parseInt(split[2]), split[3], split[4]);
        }
        @NotNull
        public static RiotClient get() {
            try {
                if (cached != null) {
                    long newLastModified = LOCKFILE.lastModified();
                    if (newLastModified == lastModified) {
                        return cached;
                    }
                }
                String s = Files.readAllLines(LOCKFILE.toPath()).get(0);
                cached = fromString(s);
                lastModified = LOCKFILE.lastModified();
                return cached;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        public String getAuthorizationHeader() {
            return "Basic " + Base64.getEncoder().encodeToString(("riot:" + password).getBytes());
        }
    }
}
