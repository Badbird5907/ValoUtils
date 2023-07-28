import {Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {Profile} from "@/types/profile.ts";
import {useEffect, useState} from "react";
import CustomButton from "@/components/button.tsx";
import formatUnixMillis from "@/util/format-date.ts";
import {useDynamicModal} from "@/components/dynamic-modal.tsx";
import {FaPlus, FaShare, FaTrash} from "react-icons/fa6";
import {FaEdit} from "react-icons/fa";
import {getData} from "../../electron/util/share.ts";

const SettingsProfiles = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const {showModal, closeModal} = useDynamicModal();
    useEffect(() => {
        if (window.Main) {
            window.Main.on("settings:profile:list", (message: string) => {
                setProfiles(JSON.parse(message).profiles);
            });
            window.Main.send("settings:profile:list");
            return () => {
                window.Main.removeAllListeners("settings:profile:list");
            }
        }
    }, [])
    return (
        <div>
            <div className={"flex my-4 items-center justify-between px-4"}>
                <h1 className={"text-4xl font-bold"}>Profiles</h1>
                <CustomButton onClickLoading={() => {
                    return new Promise<void>((resolve_1, reject_1) => {
                        window.Main.send("analytics:track", "profile:add", "{}");
                        showModal({
                            title: "Add Profile",
                            body: (
                                <div className={
                                    "flex flex-col gap-4"
                                }>
                                    <CustomButton onClickLoading={() => {
                                        return new Promise<void>((resolve, reject) => {
                                            if (window.Main) {
                                                window.Main.send("analytics:track", "profile:add:load_account", "{}");
                                                window.Main.on("settings:profile:add", (message: string) => {
                                                    const rawData = JSON.parse(message);
                                                    if (rawData.error) {
                                                        reject(rawData.error);
                                                        reject_1();
                                                        return;
                                                    }
                                                    resolve();
                                                    closeModal();
                                                    resolve_1();
                                                    window.Main.removeAllListeners("settings:profile:add");
                                                });
                                                window.Main.send("settings:profile:add", "current");
                                            } else {
                                                reject("No window.Main");
                                            }
                                        });
                                    }}>Load from account</CustomButton>
                                    <div className={"flex-row flex h-full"}>
                                        <Input className={"w-4/5"} label={"Share Code"} id={"share-code"}/>
                                        <CustomButton className={"h-full w-fit ml-4 " +
                                            "py-5" // TODO figure out why the height isn't working
                                        } onClickLoading={() => {
                                            return new Promise<void>(async (resolve, reject) => {
                                                    if (window.Main) {
                                                        window.Main.send("analytics:track", "profile:add:load_share", "{}");
                                                        const input = window.document.getElementById("share-code") as HTMLInputElement;
                                                        const inputData = input.value;
                                                        if (!inputData) {
                                                            reject("No input data");
                                                            return;
                                                        }
                                                        if (inputData.length != 10) {
                                                            reject("Invalid share code");
                                                            return;
                                                        }
                                                        const data = await getData(inputData);
                                                        if (!data) {
                                                            reject("Invalid data returned by server");
                                                        }
                                                        const save = () => {
                                                            window.Main.on("settings:profile:add", (message: string) => {
                                                                const rawData = JSON.parse(message);
                                                                if (rawData.error) {
                                                                    reject(rawData.error);
                                                                    reject_1();
                                                                    return;
                                                                }
                                                                resolve();
                                                                closeModal();
                                                                resolve_1();
                                                                window.Main.removeAllListeners("settings:profile:add");
                                                            });
                                                            window.Main.send("settings:profile:add", "clipboard");
                                                        }
                                                        const match = !data.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
                                                        if (data.length < 2500 || match) { // if it's not base64 or it's too short to be a profile
                                                            window.Main.send("analytics:track", "profile:add:load_clipboard:error", JSON.stringify({
                                                                length: data.length,
                                                                match
                                                            }));
                                                            showModal({
                                                                title: "This doesn't look like a profile",
                                                                body: "This doesn't look like a profile! Are you sure you want to continue?",
                                                                footer: (
                                                                    <>
                                                                        <CustomButton className={"mr-4"}
                                                                                      color={"danger"}
                                                                                      onPress={() => {
                                                                                          closeModal();
                                                                                          reject();
                                                                                          reject_1();
                                                                                      }}>Cancel</CustomButton>
                                                                        <CustomButton onPress={() => {
                                                                            save();
                                                                        }}>Continue</CustomButton>
                                                                    </>
                                                                ),
                                                                onClose: () => {
                                                                    reject();
                                                                    reject_1();
                                                                }
                                                            });
                                                        } else {
                                                            save();
                                                        }
                                                    } else {
                                                        reject("No window.Main");
                                                    }
                                                }
                                            )
                                                ;
                                        }
                                        }><FaPlus/></CustomButton>
                                    </div>
                                </div>
                            ),
                            footer: (
                                <CustomButton className={"w-full"} color={"danger"}
                                              onPress={() => {
                                                  closeModal();
                                                  reject_1(); // TODO figure out why closeModal() doesn't fire onClose
                                              }}>Cancel</CustomButton>
                            ),
                            onClose: () => {
                                resolve_1();
                            }
                        });
                    });
                }}><FaPlus/>Add</CustomButton>
            </div>
            <p className={"text-center text-gray-400 pb-4"}>Make sure you have the game <b
                className={"text-bold"}>CLOSED</b>, and Riot Client should be open.</p>

            <Table aria-label={"Profiles"} className={"px-4"}>
                <TableHeader>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Created On</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                    {profiles.map((profile, i) =>
                        <TableRow key={i}>
                            <TableCell>{profile.name}</TableCell>
                            <TableCell>{formatUnixMillis(profile.created)}</TableCell>
                            <TableCell>
                                <CustomButton className={"mr-4"} onClickLoading={() => {
                                    return new Promise<void>((resolve, reject) => {
                                        if (window.Main) {
                                            window.Main.send("analytics:track", "profile:load", "{}");
                                            window.Main.on("settings:profile:load", (message: string) => {
                                                const rawData = JSON.parse(message);
                                                if (rawData.error) {
                                                    reject(rawData.error);
                                                    return;
                                                }
                                                resolve();
                                                window.Main.removeAllListeners("settings:profile:load");
                                            });
                                            window.Main.send("settings:profile:load", profile.name);
                                        } else {
                                            reject("No window.Main");
                                        }
                                    });
                                }}>
                                    Load
                                </CustomButton>
                                <CustomButton className={"mr-4"} onClickLoading={() => {
                                    return new Promise<void>((resolve, reject) => {
                                        showModal({
                                            title: "Edit Profile",
                                            body: (
                                                <div id={"edit-profile-div"}>
                                                    <Input label={"Name"} defaultValue={profile.name}/>
                                                </div>
                                            ),
                                            footer: (
                                                <>
                                                    <CustomButton className={"mr-4"} color={"danger"}
                                                                  onPress={() => {
                                                                      closeModal();
                                                                      resolve();
                                                                  }}>Cancel</CustomButton>
                                                    <CustomButton onPress={() => {
                                                        if (window.Main) {
                                                            window.Main.send("analytics:track", "profile:edit", "{}");
                                                            window.Main.on("settings:profile:rename", (message: string) => {
                                                                const rawData = JSON.parse(message);
                                                                if (!rawData.success) {
                                                                    reject(rawData.error);
                                                                    return;
                                                                }
                                                                resolve();
                                                                closeModal();
                                                                window.Main.removeAllListeners("settings:profile:rename");
                                                            });
                                                            const document = window.document.getElementById("edit-profile-div");
                                                            if (!document) {
                                                                reject("No document");
                                                                return;
                                                            }
                                                            const input = document.querySelector("input");
                                                            if (!input) {
                                                                reject("No input found");
                                                                return;
                                                            }

                                                            window.Main.send("settings:profile:rename", profile.name, input.value);
                                                        } else {
                                                            reject("No window.Main");
                                                        }
                                                    }}>Save</CustomButton>
                                                </>
                                            ),
                                            onClose: () => {
                                                resolve();
                                            },
                                        });
                                    });
                                }}>
                                    <FaEdit/>
                                </CustomButton>
                                <CustomButton className={"mr-4"} onClickLoading={() => {
                                    return new Promise<void>((resolve, reject) => {
                                        if (window.Main) {
                                            window.Main.send("analytics:track", "profile:share", "{}");
                                            window.Main.on("settings:profile:share", (message: string) => {
                                                const rawData = JSON.parse(message);
                                                if (rawData.error) {
                                                    reject(rawData.error);
                                                    return;
                                                }
                                                showModal({
                                                    title: "Share Profile",
                                                    body: (
                                                        <div className={"pt-4"}>
                                                            <Input label={"Share Code"} defaultValue={rawData.code}
                                                                   labelPlacement={"outside"}
                                                                   isReadOnly
                                                            />
                                                            <span className={"text-gray-400"}>The share code will expire in 90 days.</span>
                                                        </div>
                                                    ),
                                                    footer: (
                                                        <>
                                                            <CustomButton className={"w-full"}
                                                                          onClickLoading={() => {
                                                                              return new Promise<void>((resolve, reject) => {
                                                                                  if (window.Main) {
                                                                                      window.Main.send("analytics:track", "profile:share:copy", "{}");
                                                                                      window.Main.send("clipboard:set", rawData.code);
                                                                                      resolve();
                                                                                  } else {
                                                                                      reject("No window.Main");
                                                                                  }
                                                                              });
                                                                          }}
                                                            >Copy</CustomButton>
                                                            <CustomButton className={"w-full"} color={"danger"}
                                                                          onPress={() => {
                                                                              closeModal();
                                                                              resolve();
                                                                          }}>Close</CustomButton>
                                                        </>
                                                    ),
                                                });
                                                resolve();
                                                window.Main.removeAllListeners("settings:profile:share");
                                            });
                                            window.Main.send("settings:profile:share", profile.name);
                                        } else {
                                            reject("No window.Main");
                                        }
                                    });
                                }}>
                                    <FaShare/>
                                </CustomButton>
                                <CustomButton className={""} color={"danger"} onClickLoading={() => {
                                    return new Promise<void>((resolve, reject) => {
                                        if (window.Main) {
                                            window.Main.send("analytics:track", "profile:remove", "{}");
                                            window.Main.on("settings:profile:remove", (message: string) => {
                                                const rawData = JSON.parse(message);
                                                if (rawData.error) {
                                                    reject(rawData.error);
                                                }
                                            });
                                            window.Main.send("settings:profile:remove", profile.name);
                                            resolve();
                                        } else {
                                            reject("No window.Main");
                                        }
                                    });
                                }}>
                                    <FaTrash/>
                                </CustomButton>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default SettingsProfiles;