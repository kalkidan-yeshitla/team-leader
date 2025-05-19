import { Dialog  } from "@headlessui/react";

import { ArrowBigLeft, MessageSquare, Paperclip, Plus, X} from "lucide-react"
import { useState } from "react";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';




type SubTask ={
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  assignee: string;
  status: 'To Do' | 'In Progress' | 'Done';
  key: string;
  progress: number;

};

type Task ={
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  description: string;
  assignee: string;
  status?: 'To Do' | 'In Progress' | 'Done';
  dueDate?: string;
  project: string;
  key: string;
  weight?: number;
  progress: number;
  lastUpdated?: string;
  subtask: SubTask[];
};

type FileAttachment = {
  id:string;
  name: string;
  size: number;
  type: string;
  url: string;
}

type ChatMessage = {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  senderId: string;
  attachments?: FileAttachment[];
};

type Project = {
  id:string;
  name: string;
  members: string[];
  chat?: ChatMessage[];

};

type Member = {
  id: number;
  name: string;
  role: string;
  projectId:  string[];
}



const initialTasks: Task[] =[
  {
    id: "1",
    key: "PM-1",
    title: "user management",
    priority: "High",
    assignee:"Kalkidan",
    status:"In Progress",
    description:"login, registration, and edit profile",
    project:"1",
    progress: 30,
    weight: 7,
    lastUpdated: "2025-04-14 10:30 AM",
    subtask: [
    {
      id: "1-1",
      key: "PMUM-1-1",
      title: "Login",
      description: "user login using react",
      priority: "High",
      assignee: "Kalkidan",
      status: "In Progress",
      progress: 50,
    },
  ],
 },

 {
  id: "2",
  key: "PM-2",
  title: "Registration",
  priority:"Low",
  assignee: "Mahlet",
  status: "Done",
  description:"login, registration, and edit profile",
  project: "2",
  weight: 4,
  progress:100,
  subtask: [
  {
    id: "2-1",
    key: "PM-2-1",
    title: "user register",
    description: "user login using react",
    priority: "High",
    assignee: "Mahlet",
    status: "Done",
    progress: 100,
  },
],
},
{
  id: "3",
  key: "PM-3",
  title: "Mobile App Design",
  priority: "Medium",
  assignee: "Dehine",
  status: "In Progress",
  description: "Design mobile app UI",
  project: "2",
  weight: 6,
  subtask: [],
  progress: 50,

},

{
  id: "4",
  key: "PM-4",
  title: "Frontend Development",
  priority: "Medium",
  assignee: "Mahlet",
  status: "To Do",
  description: "Build the frontend of profile view",
  project: "1",
  subtask: [],
  weight: 3,
  progress: 0,
}

];

const projects: Project[] =[
  { id: "1", name:"Project Management",members:["Kalkidan", "Mahlet"],
    chat: [
              {id: "1",
                sender: "You",
                message: "Hi team, it is urgent project so lets make it quick!",
                timestamp: new Date(Date.now() - 86400000),
                senderId: "You"
              },
              {id: "2",
                sender: "Kalkidan",
                message: "Sure, we will do it! ",
                timestamp: new Date(Date.now() - 43200000),
                senderId: "kalkidan",
              },
              {id: "3",
                sender: "Mahlet",
                message: "Good luck everyone! ",
                timestamp: new Date(Date.now() - 43200000),
                senderId: "mahlet",
              },

            ]
  },
  { id: "2", name:"Mobile App Development", members: ["Dehine", "Mahlet"]},

];

const allMembers: Member[] = [
  {id: 1, name: "Kalkidan",role: "Frontend Developer", projectId: ["1"] },
  {id: 2, name: "Mahlet",role: "Frontend Developer", projectId: ["1","2"]},
  {id: 3, name: "Dehine", role: "Backend Developer", projectId: ["2"] },
 
]


const Tasks = ({darkMode}:{darkMode:boolean}) => {
  const [tasks,setTasks]= useState<Task[]>(initialTasks);
  const [selectedTaskId, setSelectedTaskId]= useState<string>(initialTasks[0]?.id || "");
  const [selectedSubTask, setSelectedSubTask]= useState<SubTask | null>(null);
  const [showModal, setShowModal]= useState(false);
  const [assignees, setAssignees]= useState<{id:string, name:string}[]>([
     {id: "1", name: "Kalkidan"},
     {id: "2", name: "Mahlet"},
     {id: "3", name: "Dehine"},
    ]);
  const [selectedProjectId, setSelectedProjectId]= useState<string>("");
  const [newComment, setNewComment] = useState("");
  const [showRightPanel, setShowRightPanel]= useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [ showTableView, setShowTableView] = useState(true);

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [newAssignee, setNewAssignee] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);


  
  const [newChatMessage, setNewChatMessage] = useState("");
  const [activeProjectChat, setActiveProjectChat] = useState<Project | null>(null);
  const [currentUser]= useState("You");

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const selectedTask = tasks.find((task)=> task.id === selectedTaskId)!;

  const filterTasks= tasks.filter((task)=>{
    
    const matchesProject = !selectedProjectId || task.project === selectedProjectId;
    const matchesMember = !selectedMember || task.assignee === selectedMember;

    return  matchesProject && matchesMember;
  });

  const projectMembers = selectedProjectId ? 
       allMembers.filter(member => member.projectId.includes( selectedProjectId)) : allMembers;

  

  const notifySuccess = () => toast.success("Task created successfully!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    progress: undefined,
    theme: darkMode ? "dark" : "light",
  });

  const handleCreate =(newTask: Task) => {
    setTasks((prev)=> [...prev, newTask]);
    setShowModal(false);
    notifySuccess();
  };

  const addAssignee= (name: string) =>{
    if(name && !assignees.some(a =>a.name === name)) {
      setAssignees([...assignees, {id: Date.now().toString(), name}]);
    }
  };

  const handleReassign = () => {
    if(!selectedTask) return;

    setTasks(tasks.map(task => {
      if (task.id === selectedTaskId) {
        const updatedTask = {...task,assignee: newAssignee};

        if(selectedTask) {
          updatedTask.subtask = task.subtask.map(subtask => {
            if(subtask.assignee === selectedTask.assignee) {
              return {...subtask, assignee: newAssignee};
            }
            return subtask;
          });
        }
        return updatedTask;
      }
      return task;
  }));

    

    setShowReassignModal(false);
    toast.success("Task reassigned successfully!", {
      position: "top-right",
      autoClose: 2000,
      theme: darkMode ? "dark" : "light",
    });
  };
   
  const handleSubtaskClick = (subtask: SubTask) => {
    setSelectedSubTask(subtask);
    setShowRightPanel(true);
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedMember(null);

    if (projectId && selectedTask && selectedTask.project !== projectId) {
      setSelectedTaskId("");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>)=> {
    if(e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024*1024)).toFixed(1)} MB`;
  };

  const handleSendTeamMessage = async() => {
    if(!(newChatMessage.trim() || fileToUpload)|| !activeProjectChat) return;

    let attachments: FileAttachment[] = [];
    if(fileToUpload) {
      setIsUploading(true);
      try{
        for (let progress=0; progress<=100; progress += 10 ) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(progress);
        }

        attachments = [{
        id: Date.now().toString(),
        name: fileToUpload.name,
        size: fileToUpload.size,
        type: fileToUpload.type,
        url: URL.createObjectURL(fileToUpload)
        }];
      } catch (error) {
      toast.error("Failed to upload file");
      console.error("Upload error:", error);
      return;
      } finally {
        setIsUploading(false);
      }
    }

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: currentUser,
      senderId: currentUser,
      message: newChatMessage,
      timestamp: new Date(),
      attachments
    };

    const updatedProjects = projects.map(project => project.id === activeProjectChat.id ? {
      ...project,
      chat: [...(project.chat || []), newMsg]
    }: project
  );

   console.log("New team message:", newMsg);
   console.log("Updated projects:", updatedProjects);

   setActiveProjectChat({...activeProjectChat,
            chat: [...(activeProjectChat.chat || []), newMsg]
   });

   setNewChatMessage('');
   setFileToUpload(null);
   setUploadProgress(0);
  };


  return (
    <div className={` overflow-y-auto ${darkMode ? "bg-zinc-800 text-gray-100" : "bg-white text-gray-800" }`}>
        <ToastContainer/>
        <div className="p-4 mt-4 ml-2">
         <button className={`flex items-center p-2 px-4 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : 
         "bg-gray-200 hover:bg-gray-300"}`}
              onClick={()=>setShowModal(true)}>
          <Plus size={16} className="mr-2"/> Create
         </button>
        </div>

       <div className="flex h-screen">
         
         <div className={`w-1/5 border border-double rounded-lg ml-5 p-4 overflow-y-auto ${darkMode ? " bg-zinc-800 border-gray-600":"bg-gray-50 border-gray-300"} `}>
          <h2 className="text-2xl font-bold mb-6">Members</h2>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Project</h2>
            <div className="flex items-center mb-4">
              <select
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className={`w-full p-2 rounded-md ${darkMode ? "bg-gray-600 text-white" : "bg-gray-100"} border ${darkMode ? "border-gray-700" : "border-gray-300"}`}
               >
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
               </select>
             </div>

             {selectedProjectId && (
              <button  onClick={()=> {
                         const project = projects.find(p => p.id === selectedProjectId);
                         if (project) setActiveProjectChat(project);}}
                       className={`ml-2 px-4 py-2 rounded-md flex items-center ${darkMode ? "bg-purple-600 hover:bg-purple-500 text-white" 
                           : "bg-purple-100 hover:bg-purple-200 text-purple-800"}`}>
                  <MessageSquare size={16} className="mr-2"/> Team Chat
              </button>
             )}
          </div>
          

          <div className="space-y-2">
            <h3 className={`font-semibold ${darkMode ? "text-gray-300":"text-gray-500"} `}>
              {selectedProjectId ? "Project Members" : "All Members"}
            </h3>
                    
              {projectMembers.length > 0 ? (
                projectMembers.map(member => (
                <div 
                    key={`${member.projectId}-${member.id}`}
                    onClick={()=>setSelectedMember(member.name)}
                    className={`p-3 rounded-md border cursor-pointer ${selectedMember=== member.name ? 
                     (darkMode ? "bg-purple-400" : "bg-purple-300") : (darkMode ? "bg-zinc-700 hover:bg-zinc-600" : "bg-white hover:bg-gray-100")}`}>
                <div className="flex justify-between items-start">
                 <div>
                  <h4 className="font-medium">{member.name}</h4>
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                    {member.role} 
                  </span>
                </div>
               </div>  
              </div>  
                ))
             ) : (
                <div className={`p-3 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                   No members found{selectedProjectId ? " for this project" : ""}
                </div>
             )}
         </div>    
        </div>

        <div className={`flex-1 p-6 overflow-y-auto   ${darkMode ? "" : ""}`}>

          {showTableView ? (
            <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">
              {selectedProjectId 
                ? `Tasks in ${projects.find(p => p.id === selectedProjectId)?.name || 'Project'}`
                : 'All Tasks'}
              {selectedMember && ` (Assigned to ${selectedMember})`}
            </h2>

            
            {filterTasks.length > 0 ? (
              <div className={`rounded-md overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <table className="w-full">
                <thead className={`${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
                  <tr>
                    <th className="p-3 text-left">Key</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Priority</th>
                    <th className="p-3 text-left">Assignee</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Project</th>
                  </tr>
                </thead>
                <tbody>
                {filterTasks.map(task => (
                    <tr
                      key={task.id}
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setShowTableView(false);

                      }}
                      className={`cursor-pointer border-t ${darkMode ? "border-gray-700 hover:bg-zinc-700" : "border-gray-200 hover:bg-gray-50"} 
                        ${selectedTaskId === task.id ? (darkMode ? "bg-purple-900" : "bg-purple-100") : ""}`}
                    >
                      <td className="p-3">{task.key}</td>
                      <td className="p-3">{task.title}</td>
                      <td className="p-3">
                        <span className={`mt-1 text-xs px-2 py-1 rounded-full ${
                         task.priority === 'High' || task.priority === 'Urgent' ? 
                        (darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800") :
                        task.priority === 'Medium' ? 
                        (darkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800") :
                        (darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800")
                    }`}>{task.priority}</span></td>
                      <td className="p-3">{task.assignee || "Unassigned"}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${task.status === "Done" ?
                          "bg-green-100 text-green-800" : task.status === "In Progress" ?
                            "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {projects.find(p => p.id === task.project)?.name || 'Unknown Project'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            ): (
              <div className={`flex items-center justify-center h-full ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                No tasks found{selectedProjectId ? " for this project" : ""}{selectedMember ? ` assigned to ${selectedMember}` : ""}
              </div>
            )}
                 
          </div>
          ): (
            selectedTask && (
              <>
               <button onClick={()=>{
                             setShowTableView(true);
                             setSelectedTaskId("");
                            }}
                       className={`flex items-center mb-4 p-2 rounded ${darkMode ? "bg-zinc-700" : "bg-gray-100"}`}>
                        <ArrowBigLeft size={18} className="mr-2"/> Back to tasks
               </button>
               
                
                <div className="flex justify-between items-center ">
                  <h2 className={` text-2xl font-bold `}>
                    { selectedTask.title}</h2>
                  <button  onClick={()=>{
                                 setEditModal(true);
                                 setTaskToEdit(selectedTask); 
                                }}
                       className={`text-sm px-2 py-1 rounded-xl ${darkMode ? "bg-green-900 hover:bg-green-800 text-green-300" : "bg-green-100 hover:bg-green-200 text-green-800"}`}>
                    Edit
                  </button>
               </div>
                  <div className="flex items-center space-x-4 mt-2 mb-6">
                   <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {selectedTask.key}
                   </span>
                   <span className={`text-sm ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                        {projects.find(p => p.id === selectedTask.project)?.name || 'Unknown Project'}
                   </span>
                  </div>
                
  
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <div className={`p-4 rounded-md ${darkMode ? "bg-gray-600" : " bg-gray-100"}`}>
                    {selectedTask.description || (
                      <span className={`${darkMode ? "text-gray-400" : "text-gray-100"}`}>No description</span>
                    )}
  
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Assigned To:</h3>
                  <div className={`w-fit py-2 flex items-center p-4 rounded-md ${darkMode ? "bg-gray-600" : " bg-gray-100"}`}>
                    {selectedTask.assignee || (
                      <span className={`${darkMode ? "text-gray-400" : "text-gray-100"}`}>Unassigned</span>
                    )}

                    <button onClick={()=>{
                               setNewAssignee(selectedTask.assignee || "");
                               setShowReassignModal(true);}}
                            className={` relative left-3/4 text-sm border rounded-xl px-2 py-2 ${darkMode ? "bg-green-900 hover:bg-green-800 text-green-300" : "bg-green-100 hover:bg-green-200 text-green-800"}`}>
                              Reassign
                            </button>
  
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <h3 className="font-medium">Priority</h3>
                    <span className={`mt-1 text-xs px-2 py-1 rounded-full ${
                      selectedTask.priority === 'High' || selectedTask.priority === 'Urgent' ? 
                        (darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800") :
                        selectedTask.priority === 'Medium' ? 
                        (darkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800") :
                        (darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800")
                    }`}>{selectedTask.priority}</span>
                  </div>

                  <div>
                    <h3 className="font-medium">Weight</h3>
                    <p className="mt-1 text-sm ml-2">
                      {selectedTask.weight || "Not specified" }
                         
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Progress</h3>
                    <div className={`mt-1 w-32 h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                     <div className={`h-2 rounded-full ${selectedTask.progress < 30 ? "bg-red-500" : selectedTask.progress < 70 
                           ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{ width: `${selectedTask.progress}%`}} >         
                     </div>

                     <span className="text-sm"> {selectedTask.progress}% Completed </span>
                    </div>
                  </div>
                </div>
  
                {selectedTask.subtask && selectedTask.subtask.length > 0 && (
                  <div className="mb-6 overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-2">Sub Tasks</h3>
                    <div  className={`rounded-md overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                      <table className={`w-full`}>
                        <thead className={`bg-gray-200 ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
                          <tr>
                            
                            <th className="p-3 text-left">Key</th>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Priority</th>
                            <th className="p-3 text-left">Assignee</th>
                            <th className="p-3 text-left">Status</th>
                          </tr>
  
                        </thead>
                        <tbody>
                         {selectedTask.subtask.map((subtask)=>(
                           <tr 
                              key={subtask.id}
                              onClick={()=> handleSubtaskClick(subtask)}
                              className={`cursor-pointer border-t ${darkMode ? "border-gray-700 hover:bg-zinc-700" : "border-gray-200 hover:bg-gray-50"}`}>
                             
                             <td className="p-3">{subtask.key}</td>
                             <td className="p-3">{subtask.title}</td>
                             <td className="p-3">{subtask.priority}</td>
                             <td className="p-3">{subtask.assignee || "Unassigned" }</td>
                             <td className="p-3">
                               <span className={`text-xs px-2 py-1 rounded-full ${subtask.status === "Done" ?
                                     "bg-green-100 text-green-800" : subtask.status === "In Progress" ?
                                     "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                                 {subtask.status}
                               </span>
                             </td>
                           </tr>
                         ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                 <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Confluence content</h3>
                  <div className="space-y-2">
                    
                    <div className={`p-3 rounded-md ${darkMode ? "bg-gray-600" : "bg-gray-100"}`}>
                      <input 
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className={`w-full bg-transparent focus:outline-none ${darkMode ? "placeholder-gray-400" : "placeholder-gray-400"}`}/>
                    </div>
                    
                  </div>
                 </div>
              </>
            )
             )}
            </div>
         

          {showRightPanel && selectedSubTask && (
            <div className={`w-1/4 p-6 overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
              <div className={`flex justify-between items-center mb-6`}>
                <h2 className="text-xl font-bold"> {selectedSubTask.title}</h2>
                <button 
                   onClick={()=> setShowRightPanel(false)}
                   className={`p-1 rounded-md ${darkMode ? "hover:bg-gray-700": "hover:bg-gray-200"}`}>
                     <X className="h-5 w-5"/>
                   </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <div className={`p-4 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  {selectedSubTask.description || (
                    <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>No description</span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Status</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${selectedSubTask.status === "Done" ?
                                     "bg-green-100 text-green-800" : selectedSubTask.status === "In Progress" ?
                                     "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                                 {selectedSubTask.status}
                </span>
              </div>

                <div className="mb-6">
                    <h3 className="font-medium">Progress</h3>
                    <div className={`mt-1 w-32 h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                     <div className={`h-2 rounded-full ${selectedSubTask.progress < 30 ? "bg-red-500" : selectedSubTask.progress < 70 
                           ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{ width: `${selectedSubTask.progress}%`}} >         
                     </div>

                     <span className="text-sm"> {selectedSubTask.progress}% Completed</span>
                    </div>
                 </div>


              <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Activity</h3>
              <div className="flex items-center mb-2">
                <span className="mr-2">Show:</span>
                <select className={`p-1 rounded ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <option>All</option>
                  <option>Comments</option>
                  <option>History</option>
                  <option>Work log</option>
                </select>
              </div>
              <div className={`p-3 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className={`w-full bg-transparent focus:outline-none ${darkMode ? "placeholder-gray-500" : "placeholder-gray-400"}`}
                />
              </div>
              <div className="mt-2 space-y-1">
                
                <div className={`p-2 rounded-md ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} cursor-pointer`}>
                  Status update...
                </div>
                
              </div>
            </div>


            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Assignee</span>
                  <div >
                    {selectedSubTask.assignee || (
                    <span className={`mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Unassigned</span>
                    )}
                  </div>
                </div>

                
                
                <div className="flex items-center justify-between">
                  <span>Parent</span>
                  <span className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}>{selectedTask.key} {selectedTask.title}</span>
                </div>
              </div>
            </div>


            </div>

          )}
        
        </div>

        <Dialog open={showModal} onClose={()=> setShowModal(false)}
             className={`fixed inset-0 z-50 overflow-y-auto`}>
       
          <div className={`flex items-center justify-center min-h-screen bg-black bg-opacity-50 `}>
            <Dialog.Panel className={`bg-white p-6 rounded-lg w-fit ${darkMode ? "bg-zinc-800 text-gray-300" : ""}`}>
              <Dialog.Title className={`text-lg font-bold mb-4`}>
                  Create New Task
              </Dialog.Title>
              <form  onSubmit={(e)=>{
                       e.preventDefault();
                       const formData= new FormData(e.currentTarget);
                       const title= formData.get("title") as string;
                       const description= formData.get("description") as string;
                       const priority=formData.get("priority") as any;
                       const assignee = formData.get("assignee") as string;
                       const dueDate = formData.get("dueDate") as string;
                       const project = formData.get("project") as string;
                       const weight = parseInt(formData.get("weight") as string) || 0;


                       handleCreate({
                         id: Date.now().toString(),
                         title,
                         description,
                         priority,
                         assignee,  
                         dueDate,
                         subtask: [],
                         project,
                         weight,
                         key: `PM-${Math.floor(Math.random() * 100)}`,
                         progress: 0,
                       });
                }}>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Project</label>
                  <select name="project"
                      required
                      className={`w-full p-2 border rounded ${darkMode ? "bg-zinc-700 border-zinc-600" : ""}`}>
                        <option value=""> Select Project  </option>
                          {projects.map((project)=>(
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}     
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Task Title</label>
                  <input name="title"
                      placeholder=" Task Title"
                      required
                      className={`w-full p-2 border rounded ${darkMode ? "bg-zinc-700 border-zinc-600" : ""}`}/>

               </div>
               <div className="mb-4" >
                <label className="block text-sm font-medium">Description</label>
                <textarea name="description"
                      placeholder="Description"
                      required
                      className={`w-full p-2 border rounded ${darkMode ? "bg-zinc-700 border-zinc-600" : ""}`}
                      rows={4}/>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium"> Assign To</label>
                    <div className=" flex items-center space-y-2 ">
                      <select name="assignee"
                              required
                              className={`w-full mt-2 p-2 border rounded ${darkMode ? "bg-zinc-700 border-zinc-600" : ""}`}>
                          <option value="">Select Assignee</option>
                            {assignees.map((assignee)=> (
                              <option key={assignee.id} value={assignee.name}>
                                    {assignee.name}
                              </option>
                              ))}
                      </select>
                      <input type="text"
                             placeholder="Add new team member"
                             id="newAssignee"
                             className={`flex-1 ml-2 p-2 border rounded ${darkMode ? "bg-zinc-700 border-zinc-600" : ""}`}/>
                         <button 
                             type="button"
                             onClick={()=> {
                              const input = document.getElementById('newAssignee') as HTMLInputElement;
                              if (input.value) {
                                addAssignee(input.value);
                                input.value = '';
                              }}}
                             className={` ml-2 px-3 py-2 rounded ${darkMode ? "bg-purple-600 hover:bg-purple-700" 
                                : "bg-purple-500 hover:bg-purple-600"} text-white`}>
                                  Add
                         </button> 
                     </div>                      
                    </div>

                  <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    className={`w-full p-2 border rounded ${darkMode ? "bg-zinc-700 border-zinc-600" : ""}`}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Task Weight(1-10)</label>
                  <div className="flex items-center gap-2">
                    <input type="number"
                          name="weight"
                          min={1}
                          max={10}
                          defaultValue={0}
                          className={`p-2 py-1 border rounded ${darkMode ? "bg-zinc-700 border-zinc-600" : ""}`}/>
                    
                  </div>
                  
                </div>

                <div className=" mb-4">
                   <label className="block text-sm font-medium"> Priority</label>
                   <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio"
                            name="priority"
                            value="Low"
                            className={`mr-2 h-4 w-4 border-2 ${darkMode ? 'border-gray-500' : 'border-gray-300'} rounded-full appearance-none
                                 checked:border-purple-400 checked:bg-purple-400 checked:ring-1 checked:ring-purple-400 checked:ring-offset-1`}/> 
                            Low
                    </label>
                    <label className="flex items-center">
                      <input type="radio"
                            name="priority"
                            value="Medium"
                            className={`mr-2 h-4 w-4 border-2 ${darkMode ? 'border-gray-500' : 'border-gray-300'} rounded-full appearance-none 
                              checked:border-purple-400 checked:bg-purple-400 checked:ring-1 checked:ring-purple-400 checked:ring-offset-1`}
                            defaultChecked /> Medium
                            
                    </label>

                    <label className="flex items-center">
                      <input type="radio"
                            name="priority"
                            value="High"
                            className={`mr-2 h-4 w-4 border-2 ${darkMode ? 'border-gray-500' : 'border-gray-300'} rounded-full appearance-none
                             checked:border-purple-400 checked:bg-purple-400 checked:ring-1 checked:ring-purple-400 checked:ring-offset-1`}
                             /> High
                            
                    </label>

                    <label className="flex items-center">
                      <input type="radio"
                            name="priority"
                            value="Urgent"
                            className={`mr-2 h-4 w-4 border-2 ${darkMode ? 'border-gray-500' : 'border-gray-300'} rounded-full appearance-none
                             checked:border-purple-400 checked:bg-purple-400 checked:ring-1 checked:ring-purple-400 checked:ring-offset-1`}
                             /> Urgent
                            
                    </label>
                   </div>             
                 </div>

                 


                <div >
                  <button type="button"
                          onClick={()=>setShowModal(false)}
                          className={` px-4 py-2 rounded ${
                            darkMode ? "bg-zinc-700 hover:bg-zinc-600" : "bg-gray-200 hover:bg-gray-300"
                          }`}>
                    Cancel
                  </button>

                  <button type="submit"
                        
                      className={`ml-2 px-4 py-2 rounded text-white ${
                        darkMode ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-700 hover:bg-purple-600"
                      }`}>
                    Create
                  </button>
                </div>
                 

              </form>

            </Dialog.Panel>
        
          </div>
        </Dialog>

        <Dialog open= {showReassignModal} onClose={()=> setShowReassignModal(false)}
                className={`fixed inset-0 z-50 overflow-y-auto `}>
            <div className={`flex items-center justify-center min-h-screen bg-black bg-opacity-50 `}>
              <Dialog.Panel className={`p-6 rounded-lg w-96 ${darkMode ? "bg-zinc-800 text-gray-300" : "bg-white text-gray-700"}`}>
                <Dialog.Title className={`text-lg font-bold mb-4`}>Reaasign Task</Dialog.Title>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Current Assignee</label>
                  <input type="text"
                  value={selectedTask?.assignee || "Unassigned"}
                  readOnly
                  className={`w-full p-2 rounded-md border-spacing-5 ${darkMode ? "bg-zinc-700 text-gray-300 border-gray-600" 
                      : "bg-gray-100 text-gray-700 border-gray-300"}
                         `}/>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">New Assignee</label>
                  <select value={newAssignee}
                          onChange={(e)=> setNewAssignee(e.target.value)}
                          className={`w-full p-2 rounded-md border-spacing-5 ${darkMode ? "bg-zinc-700 text-gray-300 border-gray-600" 
                      : "bg-gray-100 text-gray-700 border-gray-300"}
                         `}>
                      <option value="">Unassigned</option>  
                      {assignees.map((member)=> (
                        <option key={member.id}
                                value={member.name}>
                               {member.name}   
                        </option>
                      ))}  

                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button type= "button" onClick={()=> setShowReassignModal(false)}
                         className={`px-4 py-2 rounded ${darkMode? "bg-gray-500 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}>
                     Cancel
                  </button>

                  <button type="button" onClick={handleReassign} disabled={!newAssignee}
                         className={`px-4 py-2 rounded text-white ${darkMode? "bg-purple-600 hover:bg-zinc-500 disabled:bg-gray-500" 
                              : "bg-purple-700 hover:bg-purple-600 disabled:bg-gray-200 disabled:text-gray-700"}`}>
                      Confirm    
                  </button>
                </div>
              </Dialog.Panel>
            </div>
 
        </Dialog>

        <Dialog open={editModal} onClose={()=> setEditModal(false)}
                className={`fixed inset-0 z-50 overflow-y-auto `}>
            <div className={`flex items-center justify-center min-h-screen bg-black bg-opacity-50 `}>
              <Dialog.Panel className={`p-6 rounded-lg w-96 ${darkMode ? "bg-zinc-800 text-gray-300" : "bg-white text-gray-700"}`}>
                <Dialog.Title className={`text-lg font-bold mb-4`}>Edit Task</Dialog.Title>

                {taskToEdit && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setTasks(tasks.map(t => taskToEdit ? taskToEdit : t));
                    setEditModal(false);
                    toast.success(`Task updated successfully! `, {
                      theme:darkMode ? "dark" : "light"}); 
                     }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input type="text"
                               value={taskToEdit.title}
                               onChange={(e) => setTaskToEdit({...taskToEdit, title: e.target.value})}
                               className={`w-full p-2 rounded-md border ${darkMode ? "bg-zinc-700  border-gray-600" : " bg-white border-gray-300"}`}/>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea 
                               value={taskToEdit.description}
                               onChange={(e) => setTaskToEdit({...taskToEdit, description: e.target.value})}
                               rows={3}
                               className={`w-full p-2 rounded-md border ${darkMode ? "bg-zinc-700  border-gray-600" : " bg-white border-gray-300"}`}
                               />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Due Date</label>
                        <input type="date"
                               value={taskToEdit.dueDate}
                               onChange={(e) => setTaskToEdit({...taskToEdit, dueDate: e.target.value})}
                               className={`w-full p-2 rounded-md border ${darkMode ? "bg-zinc-700  border-gray-600" : " bg-white border-gray-300"}`}/>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <select 
                               value={taskToEdit.priority}
                               onChange={(e) => setTaskToEdit({...taskToEdit, priority: e.target.value as any})}
                             
                               className={`p-2 rounded-md border ${darkMode ? "bg-zinc-700  border-gray-600" : " bg-white border-gray-300"}`}>  
                           <option value="Low">Low </option>
                           <option value="Medium">Medium</option>
                           <option value="High">High</option>
                           <option value="Urgent">Urgent</option>

                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Weight</label>
                        <input type="number"
                               value={taskToEdit.weight}
                               onChange={(e) => setTaskToEdit({...taskToEdit, weight: e.target.value as any})}
                               className={`w-20 p-2 rounded-md border ${darkMode ? "bg-zinc-700  border-zinc-600" : " bg-white border-gray-300"}`}/>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <button type="button"
                               onClick={()=> setEditModal(false)}
                               className={`px-4 py-2 rounded-md ${darkMode ? "bg-zinc-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}>
                                Cancel
                        </button>

                        <button type="submit"
                               className={`px-4 py-2 rounded-md text-white ${darkMode ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-500 hover:bg-purple-400"}`}>
                                Save Changes
                        </button>
                      </div>

                    </div>
                  </form>
                )}
              </Dialog.Panel>       
            </div>      
        </Dialog>

        

{/* Chat Dialog */}
<Dialog open={!!activeProjectChat} onClose={() => setActiveProjectChat(null)} 
        className={`fixed inset-0 z-50 overflow-y-auto`}>
  <div className={`flex items-center justify-center min-h-screen bg-black bg-opacity-50`}>
    <Dialog.Panel className={`p-6 rounded-lg w-full max-w-md ${darkMode ? "bg-zinc-800 text-gray-300" : "bg-white text-gray-700"}`}>
      <Dialog.Title className={`text-lg font-bold mb-4 flex items-center`}>
        <span className="mr-2">Team Chat:</span>
        <span className="text-blue-500">{activeProjectChat?.name} Chat</span>
      </Dialog.Title>
      
      <div className={`h-96 overflow-y-auto mb-4 space-y-4 p-4 ${darkMode ? "bg-zinc-700  rounded" : "bg-gray-100 rounded"}`}>
        {activeProjectChat?.chat?.length ? (
          activeProjectChat.chat.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.senderId === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                  msg.senderId === currentUser 
                    ? darkMode 
                      ? "bg-blue-600 text-white" 
                      : "bg-blue-500 text-white"
                    : darkMode 
                      ? "bg-gray-700 text-gray-100" 
                      : "bg-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">
                    {msg.senderId === currentUser ? 'You' : msg.sender}
                  </span>
                  <span className="text-xs opacity-70 ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p>{msg.message}</p>

                {msg.attachments?.map((file)=>(
                  <div key={file.id} 
                       className={`mt-2 p-2 rounded ${darkMode ? "bg-blue-800" : "bg-blue-100"}`}>
                    <div className="flex items-center">
                      <Paperclip size={16} className="mr-2" />
                      <a 
                         href={file.url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-sm hover:underline">
                        {file.name}
                      </a>
                    </div>
                    <div className="text-xs mt-1">
                      {formatFileSize(file.size)} • {file.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>

      {fileToUpload && (
        <div className={`mb-2 p-3 rounded ${darkMode ? "bg-zinc-700" : "bg-gray-200"}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Paperclip size={16} className="mr-2" />
              <span className="text-sm truncate max-w-xs">{fileToUpload.name}</span>
            </div>
            <button 
               onClick={() => setFileToUpload(null)}
               className="text-red-500 hover:text-red-700" >
             <X size={16} />
            </button>
          </div>

          {isUploading && (
            <div className={`w-full h-1 mt-2 rounded-full ${darkMode ? "bg-zinc-600" : "bg-gray-300"}`}>
              <div 
                className={`h-full rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-500"}`}
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <label className={`p-2 rounded-md cursor-pointer ${darkMode ? " hover:bg-zinc-600" : " hover:bg-gray-300"}`}>
          <input 
            type="file"
            onChange={handleFileSelect}
            className="hidden"/>
          <Paperclip size={20} />
        </label>
        <input
          type="text"
          value={newChatMessage}
          onChange={(e) => setNewChatMessage(e.target.value)}
          placeholder="Type your message..."
          className={`flex-1 p-2 rounded-md border ${
            darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300"
          }`}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && newChatMessage.trim() && activeProjectChat) {
              handleSendTeamMessage();
              }
            }}
          />
        <button
          onClick={ handleSendTeamMessage}
          className={`px-4 py-2 rounded-md text-white ${
            darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400"
          }`}
          disabled={!newChatMessage.trim()}
        >
          Send
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>
       
</div>
    
  )
}

export default Tasks