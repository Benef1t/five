import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Int "mo:base/Int";
import Order "mo:base/Order";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor {
    type SubActor = actor {
        follow: shared (Principal) -> async ();
        follows: shared query () -> async [Principal];
        post: shared (Text, Text) -> async ();
        posts: shared query () -> async [Message];
        timeline: shared query () -> async [Message];
    };
    type Message = {
        msg: Text;
        author: Text;
        time: Int;
    };
    private var subs = Buffer.Buffer<Principal>(0);
    private var msgs = Buffer.Buffer<Message>(0);
    private stable var auth: ?Text = null;

    public shared func follow(p: Principal) : async () {
        subs.add(p);
    };

    public shared func set_name(t: Text) : async () {
        auth := ?t;
    };

    public query func get_name() : async ?Text {
        auth
    };


    public query func follows() : async [Principal] {
        subs.toArray()
    };

    public shared func post(otp: Text, t: Text) : async () {
        assert(otp == "123456");
        let _author = switch (auth) {
            case (?a) { a };
            case (null) { "" };
        };
        let msg: Message = {
            msg = t;
            author = _author;
            time = Time.now()
        };

        msgs.add(msg);
    };

    public query func posts() :  async [Message] {
        msgs.toArray()
    };

    public shared func timeline() : async [Message] {
        let res = Buffer.Buffer<Message>(0);
        for (i in subs.vals()) {
            let sub: SubActor = actor(Principal.toText(i));
            let temp = await sub.posts();
            for (msg in temp.vals()) {
                res.add(msg);
            };
        };
        let result = res.toVarArray();
        Array.sortInPlace<Message>(result, func (a: Message, b: Message): Order.Order {
            Int.compare(a.time, b.time)
        });
        Array.freeze(result)
    };
};