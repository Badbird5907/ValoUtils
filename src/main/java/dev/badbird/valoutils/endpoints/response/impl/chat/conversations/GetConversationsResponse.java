package dev.badbird.valoutils.endpoints.response.impl.chat.conversations;

import dev.badbird.valoutils.endpoints.response.APIResponse;
import dev.badbird.valoutils.objects.chat.Conversation;
import lombok.Data;

@Data
public class GetConversationsResponse implements APIResponse {
    public Conversation[] conversations;
}
