import { CalendarIcon, Paperclip, UserIcon } from "lucide-react";
import { useEffect,  useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import { useNotifications } from "@/components/NotificationContext";


interface ProjectFile {
  name: string;
  size: number;
  type: string;
  url: string;
}



interface Project{
  id:number;
  title: string;
  description: string;
  dueDate: string;
  assignedBy: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  status: 'To Do' | 'In Progress' | 'Done' | 'Rejected';
  progress: number;
  rejectionReason?: string;
  isTerminated?: boolean;
  files?: ProjectFile[];
}


const Projects = ({darkMode}:{darkMode:boolean}) => {
 
  const [projects, setProjects]= useState<Project[]>([]);
  const [selectedProject, setSelectedProject]= useState<Project| null>(null);
  const [loading, setLoading]= useState(true);
  const [newProjectNotification, setNewProjectNotification] = useState(false);
  const [newProject, setNewProject]= useState<Project[]>([]);
  const { addNotification }= useNotifications();
  const [rejectionDialog, setRejectionDialog]=useState(false);
  const [projectToReject, setProjectToReject] = useState<Project | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showTerminated, setShowTerminated]= useState(false);
  const [previewFile, setPreviewFile] = useState<ProjectFile | null> (null);
  

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024*1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel')) return '📊';
    if (fileType.includes('image')) return '🖼️';
    return '📁';
  };
  

  const assignNewProject = () => {
    const newProject: Project = {
      id: Math.floor(Math.random() * 1000),
      title: `New Project ${Math.floor(Math.random() * 100)}`,
      description: "Newly assigned project",
      dueDate:"2025-07-15",
      priority:"Urgent",
      status: "To Do",
      progress: 0,
      assignedBy: "Genet",
      assignedTo: "",
      files: [
       { name: "Project_File.pdf",
        size: 1024 * 100,
        type: "application/pdf",
        url: "https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_PDF.pdf"
      },
      
      ]
    };

    setNewProject(prev => [...prev, newProject]);
    
    addNotification({
      type: 'project',
      title: 'New Project Assigned',
      message:`You've been assigned to "${newProject.title}"`,
      metadata: { projectId: newProject.id}
    });
  };

  const acceptNewProject = (project: Project)=> {
    setProjects(prev => [project, ...prev]);
    setNewProject(prev => prev.filter(p => p.id !==project.id));

    toast.success('Project accepted successfully', {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: darkMode ? "dark" : "light",
   });
    
  };


  const rejectProject = (project: Project, reason: string) => {
   const rejectedProject = {
    ...project,
    status: 'Rejected',
    isTerminated: true,
    rejectionReason: reason
   };
  
   setProjects(prev => [rejectedProject, ...prev]);
   setNewProject(prev => prev.filter(p => p.id !== project.id));
   setRejectionDialog(false);
   setRejectionReason('');
  
   toast.success('Project rejected successfully', {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: darkMode ? "dark" : "light",
   });
};
  
 const activeProjects = projects.filter(project => !project.isTerminated);
 const terminatedProjects =projects.filter(project => project.isTerminated);

  useEffect(()=> {
    const fetchProjects =async () => {
      setLoading(true);
      const data = await new Promise<Project[]>(resolve =>
        setTimeout(() =>
         resolve([
          {
            id: 1,
            title: "Project 1",
            description: "build project management tool",
            dueDate: "2025-06-12",
            assignedBy: "Genet",
            assignedTo: "Team 1",
            priority: "High",
            status: "In Progress",
            progress: 40,
            files: [
              { name: "Project_File.pdf",
                size: 1024 * 100,
                type: "application/pdf",
                url: "https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_PDF.pdf"
              },
            ],
            


        },
        {
          id: 2,
          title: "Project 2",
          description: "build project management tool",
          dueDate: "2025-06-12",
          assignedBy: "Genet",
          assignedTo: "Team 1",
          priority: "High",
          status: "To Do",
          progress: 0,
          

        },    
       ]),1000)
      );
       setProjects(data);
       setLoading(false);

    };
    fetchProjects();
  }, []);

  
  return (
    <div className={`p-4 overflow-y-auto ${darkMode ? "bg-zinc-800 text-gray-100" : "bg-white text-gray-800"}`}>
      <ToastContainer />
      
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={()=>{
              assignNewProject();
              setNewProjectNotification(true);

            }}
            className={`px-4 py-2 rounded-lg ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          >
            Simulate New Assignment
          </button>
        </div>
      </div>

      {/* New Projects Notification Section */}
      {newProjectNotification && newProject.length > 0 && (
        <div className={`mb-8 p-4 border rounded-lg ${darkMode ? "bg-zinc-800 border-gray-600" : "bg-blue-50 border-gray-300"}`}>
          <h2 className="text-lg font-semibold mb-4">New Project Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newProject.map(project => (
              <Card key={project.id} className={`${darkMode ? "bg-gray-800" : "bg-white"} border rounded-lg overflow-hidden shadow-sm`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800"}`}>
                      New
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <UserIcon size={16} className="mr-2" />
                      <span>Assigned by: {project.assignedBy}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CalendarIcon size={16} className="mr-2" />
                      <span>Due: {project.dueDate}</span>
                    </div>
                  </div>

                  {project.files && project.files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Attachments:</h4>
                      <div className="space-y-2">
                        {project.files.map((file, index) => (
                          <div key={index}
                               onClick={()=> setPreviewFile(file)}
                               className={`flex items-center p-2 rounded-md cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                             <span className="mr-2 "> {getFileIcon(file.type)} </span>
                             <div className="flex-1 min-w-0">
                              <p className="text-sm truncate"> {file.name} </p>
                              <p className="text-xs text-muted-foreground"> {formatFileSize(file.size)}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center gap-3">
                   <button
                      onClick={() => acceptNewProject(project)}
                      className={`mt-4 w-full py-2 rounded-md ${darkMode ? "bg-green-900 hover:bg-green-800 text-green-300" : "bg-green-200 text-green-800 hover:bg-green-300"} `}
                    >
                    Accept Project
                   </button>
                   <button
                    onClick={() => {
                      setProjectToReject(project);
                      setRejectionDialog(true);
                      }}
                    className={`mt-4 w-full py-2 rounded-md ${darkMode ? "bg-red-900 text-red-300 hover:bg-red-800" : "bg-red-200 text-red-800 hover:bg-red-300"} `}
                    >
                    Reject Project
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}


      {/* Main Projects Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Projects Table View - Simplified */}
          <div className="mb-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? "bg-gray-800" : "bg-gray-200"}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Attachment</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? "divide-gray-700 bg-zinc-800 " : "divide-gray-200 bg-white"}`}>
                {activeProjects.map(project => (
                  <tr 
                    key={project.id} 
                    className={`hover:${darkMode ? "bg-gray-800 hover:bg-zinc-700" : "bg-gray-50 hover:bg-gray-50"} cursor-pointer`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{project.title}</div>
                      <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{project.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{project.assignedTo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{project.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'Done' ? 
                          (darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800") :
                        project.status === 'In Progress' ? 
                          (darkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800") :
                          (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800")
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-32 h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                          <div 
                            className={`h-full rounded-full ${
                              project.progress < 30 ? "bg-red-500" :
                              project.progress < 70 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.files && project.files.length > 0 ? (
                        <div className="flex items-center">
                          <Paperclip className="mr-1 h-4 w-4"/>
                          <span className="text-sm">
                            {project.files.length} file {project.files.length !== 1 ? 's':''}
                          </span>
                        </div>
                      ): (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Terminated project Card View */}
          {terminatedProjects.length > 0 && (
            <div className="mt-8">
              <button  onClick={()=> setShowTerminated(!showTerminated)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}>
                <span className="font-semibold">
                  {showTerminated ? 'Hide': 'Show'} Terminated Projects ({terminatedProjects.length})
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${showTerminated ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showTerminated && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {terminatedProjects.map(project => (
                  <Card 
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`cursor-pointer transition-all hover:shadow-lg ${darkMode ? "bg-gray-800 hover:border-purple-500" : "bg-white hover:border-purple-400"}`}
                  >
                     <CardContent className="p-6">
                       <div className="flex justify-between items-start">
                         <h3 className="text-lg font-semibold">{project.title}</h3>
                         <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800"}`}>
                           Rejected
                         </span>   
                       </div>
                       <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                         {project.description}
                       </p>
                  
                       <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm">
                          <UserIcon size={16} className="mr-2" />
                          <span>Assigned by: {project.assignedBy}</span>
                         </div>
                        <div className="flex items-center text-sm">
                      <CalendarIcon size={16} className="mr-2" />
                      <span>Due: {project.dueDate}</span>
                    </div>

                    <div className="text-sm">
                      <p className="font-medium mt-2">Rejection Reason:</p> 
                      <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                         {project.rejectionReason || "No reason provided"}
                      </p> 
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>     
              )}
            </div>
          )}   
        </>
      )}

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className={darkMode ? "bg-gray-800" : "bg-white"}>
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.title}</DialogTitle>
                <DialogDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Assigned by: {selectedProject.assignedBy} | Due: {selectedProject.dueDate}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p className={`mt-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{selectedProject.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Assigned To</h3>
                    <p className={`mt-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{selectedProject.assignedTo}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Priority</h3>
                    <span className={`mt-1 text-xs px-2 py-1 rounded-full ${
                      selectedProject.priority === 'High' || selectedProject.priority === 'Urgent' ? 
                        (darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800") :
                        selectedProject.priority === 'Medium' ? 
                        (darkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800") :
                        (darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800")
                    }`}>{selectedProject.priority}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Status</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedProject.status === 'Done' ? 
                        (darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800") :
                      selectedProject.status === 'In Progress' ? 
                        (darkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800") :
                      selectedProject.status === 'Rejected' ?
                        (darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800") :
                        (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800")
                    }`}>{selectedProject.status}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Progress</h3>
                    <div className="flex items-center mt-1">
                      <div className={`w-24 h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                        <div 
                          className={`h-full rounded-full ${
                            selectedProject.progress < 30 ? "bg-red-500" :
                            selectedProject.progress < 70 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${selectedProject.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm">{selectedProject.progress}%</span>
                    </div>
                  </div>
                </div>
                {selectedProject.files && selectedProject.files.length > 0 && (
                  <div>
                    <h3 className="font-medium">Attachment</h3>
                    <div className="mt-2 space-y-2">
                      {selectedProject.files.map((file, index)=> (
                        <div key={index}
                             onClick={()=> setPreviewFile(file)}
                             className={`flex items-center p-2 rounded-md cursor-pointer ${darkMode ? "hover:bg-zinc-700": "hover:bg-gray-100"}`}>
                          <span className="mr-2">{getFileIcon(file.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.isTerminated && (
                  <div>
                    <h3 className="font-medium">Rejection Reason</h3>
                    <p className={`mt-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {selectedProject.rejectionReason || "No reason provided"}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={rejectionDialog} onOpenChange={setRejectionDialog}>
        <DialogContent className={darkMode ? "bg-gray-800" : "bg-white"}>
          <DialogHeader>
            <DialogTitle>Rejection Reason</DialogTitle>
            <DialogDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Pease provide a reason for rejecting {projectToReject?.title}
            </DialogDescription>
          </DialogHeader>
          <textarea  className={`w-full p-2 mt-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                   rows={4}
                   value={rejectionReason}
                   onChange={(e) => setRejectionReason(e.target.value)}
                   placeholder="Enter your reason for rejection..."/>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={()=> {
                       setRejectionDialog(false);
                       setRejectionReason('');
                      }}
                    className={`px-4 py-2 rounded-md ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300" }`}  
             >
              Cancel
             </button>
             <button onClick={()=> {
                       if (projectToReject) {
                        rejectProject(projectToReject, rejectionReason);
                       }
                  }}
                 className={`px-4 py-2 rounded-md text-white ${ darkMode ? "bg-red-700 hover:bg-red-600" : "bg-red-500 hover:bg-red-600"}`}
                 disabled={!rejectionReason.trim()}>
                  Send
                 </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewFile} onOpenChange={()=> setPreviewFile(null)}>
        <DialogContent className={darkMode ? "bg-gray-800" : "bg-white"}>
          {previewFile && (
            <>
               <DialogHeader>
                 <DialogTitle>{previewFile.name}</DialogTitle>
                 <DialogDescription className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {formatFileSize(previewFile.size)}
                 </DialogDescription>
               </DialogHeader>
               <div className="mt-4">
                {previewFile.type.includes('image') ? (
                  <img src={previewFile.url}
                       alt={previewFile.name}
                       className="w-full h-auto rounded-md" />
                ): (
                  <div className={`p-8 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-100"} text-center`}>
                    <p className="text-lg font-medium mb-4">
                      {getFileIcon(previewFile.type)} {previewFile.name}
                    </p>
                    <a  href={previewFile.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className={`px-4 py-2 rounded-md text-white ${darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400" } `}>
                     Download File
                    </a>
                  </div>
                )}
               </div>            
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
            
  );
};

export default Projects;