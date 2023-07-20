package dev.badbird.valoutils.manager;

import com.google.gson.Gson;
import dev.badbird.valoutils.util.OkHttpCertFixer;
import dev.badbird.valoutils.util.RiotClientUtil;
import lombok.Data;
import okhttp3.OkHttpClient;
import okhttp3.Request;

@Data
public class RiotClientConnectionManager {
    private OkHttpClient client = OkHttpCertFixer.fix(new OkHttpClient.Builder()).build();
    private Gson gson = new Gson();

    public RiotClientConnectionManager() {
    }

    public Request.Builder addHeaders(Request.Builder builder) {
        RiotClientUtil.RiotClient riotClient = RiotClientUtil.RiotClient.get();
        return builder.addHeader("Authorization",riotClient.getAuthorizationHeader());
    }

    public Request.Builder newRequest(String path) {
        RiotClientUtil.RiotClient riotClient = RiotClientUtil.RiotClient.get();
        Request.Builder builder = new Request.Builder();
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        return addHeaders(builder).url(riotClient.protocol() + "://127.0.0.1:" + riotClient.port() + path);
    }
}
