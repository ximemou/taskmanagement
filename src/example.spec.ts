
class FriendsList {
    friends = [];
    addFriend(name){
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name){
        global.console.log(`${name} is now a friend`);
    }

    removeFriend(name){
        const index = this.friends.indexOf(name);
        if(index ===-1){
            throw new Error('Friend nor found!');
        }
        this.friends.splice(index,1);
    }
}

describe('FriendsList',()=>{

    let friendsList;

    //corre antes de cada it
    beforeEach(()=>{
        friendsList = new FriendsList();
    });

    it('initializes friends list',()=>{
        expect(friendsList.friends.length).toEqual(0);
    })


    it('adds a friend to the list',()=>{
        friendsList.addFriend('Pedro');
        expect(friendsList.friends.length).toEqual(1);
    });

    it('announces friendship', ()=>{
        friendsList.announceFriendship = jest.fn();
        expect(friendsList.announceFriendship).not.toHaveBeenCalled();
        friendsList.addFriend('Pedro');
        expect(friendsList.announceFriendship).toHaveBeenCalledWith('Pedro');
    });

    describe('removeFriend',()=>{
        it('removes a friend from the list',()=>{
            friendsList.addFriend('Pedro');
            expect(friendsList.friends[0]).toEqual('Pedro');
            friendsList.removeFriend('Pedro');
            expect(friendsList.friends[0]).toBeUndefined();
        });

        it('throws an error as friend does not exist',()=>{
            expect(()=>friendsList.removeFriend('Ariel')).toThrow(new Error('Friend nor found!'));
        });
    });
});