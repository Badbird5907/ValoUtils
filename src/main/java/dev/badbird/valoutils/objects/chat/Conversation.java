package dev.badbird.valoutils.objects.chat;

public record Conversation(String cid, boolean direct_messages, boolean global_readership,
                           boolean message_history, String mid, boolean muted, boolean mutedRestriction,
                           String type, UIState uiState, int unread_count) {
    // stuff i noticed in the cid
    public boolean isParty() {
        return cid.contains("-parties");
    }

    public boolean isAttacker() {
        return cid.contains("-red");
    }

    public boolean isDefender() {
        return cid.contains("-blue");
    }

    public boolean isTeam() {
        return isAttacker() || isDefender();
    }

    public boolean isAll() {
        return cid.contains("-all");
    }

    public String getDisplayName() {
        if (isAll())
            return "All Chat";
        else if (isTeam()) {
            return "Team Chat";
        } else if (isParty()) {
            return "Party Chat";
        } else {
            return cid();
        }
    }

    @Override
    public String toString() {
        return getDisplayName();
    }

    public static record UIState(boolean changedSinceHidden, boolean hidden) {
    }
}
