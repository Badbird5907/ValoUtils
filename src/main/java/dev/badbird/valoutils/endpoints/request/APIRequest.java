package dev.badbird.valoutils.endpoints.request;

import dev.badbird.valoutils.Main;
import dev.badbird.valoutils.endpoints.response.APIResponse;
import dev.badbird.valoutils.manager.RiotClientConnectionManager;
import lombok.SneakyThrows;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Request;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;

import java.io.IOException;
import java.util.Arrays;
import java.util.concurrent.CompletableFuture;

public interface APIRequest<T extends APIResponse> {
    String getEndpoint();
    Class<T> getResponseType();
    Request.Builder addData(Request.Builder builder);
    @SneakyThrows
    default CompletableFuture<T> send(RiotClientConnectionManager connectionManager) {
        CompletableFuture<T> future = new CompletableFuture<>();
        Request.Builder builder = connectionManager.newRequest(getEndpoint());
        Request.Builder a = addData(builder);
        if (a != null) builder = a;
        Request.Builder finalBuilder = builder;
        Main.getInstance().getExecutor().execute(() -> {
            System.out.println("Sending request to " + finalBuilder.build().url());
            finalBuilder.build().headers().toMultimap().forEach((key, value) -> System.out.println(key + ": " + Arrays.toString(value.toArray())));
            connectionManager.getClient().newCall(finalBuilder.build()).enqueue(new Callback() {
                @Override
                public void onFailure(@NotNull Call call, @NotNull IOException e) {
                    future.completeExceptionally(e);
                }

                @Override
                public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                    if (!response.isSuccessful()) {
                        future.completeExceptionally(new RuntimeException("Unexpected code " + response.code()));
                    }
                    T t = connectionManager.getGson().fromJson(response.body().string(), getResponseType());
                    response.close();
                    future.complete(t);
                }
            });
        });
        return future;
    }
}
