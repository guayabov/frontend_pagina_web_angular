// Importaciones necesarias de Angular y Angular Material para componentes, formularios y servicios
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectsService } from 'app/services/projects/projects.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalCreateProjectComponent } from 'app/pages/modal-create-project/modal-create-project.component';
import { ModalEditProjectsComponent } from 'app/pages/modal-edit-projects/modal-edit-projects.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';

// Definición de la interfaz para un proyecto con nombre y estado
export interface Project {
  name: string;
  status: string;
}

// Decorador @Component que configura el componente ProjectsComponent
@Component({
  selector: 'app-projects',  // Selector HTML para el componente
  standalone: true,           // Componente autónomo (no depende de NgModule)
  imports: [                  // Módulos que se importan para usar en este componente
    CommonModule,
    BreadcrumbComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './projects.component.html', // Archivo HTML con la vista del componente
  styleUrl: './projects.component.scss'     // Archivo SCSS con los estilos del componente
})
export class ProjectsComponent {

  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = [  
    'name',
    'description',
    'status',
    'action'
  ];

  // Configuración para mostrar la ruta de navegación (breadcrumb)
  breadscrums = [
    {
      title: 'Gestión de proyectos',
      item: [],
      active: 'Listado de proyectos',
    },
  ];

  // Fuente de datos para la tabla, inicialmente vacía
  dataSource = new MatTableDataSource<any>([]);
  // Referencia al paginador de Angular Material para la tabla
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  // Formulario reactivo para los filtros de búsqueda
  projectFormSearchFilter!: FormGroup;
  // Lista para almacenar los proyectos obtenidos del backend
  projectsList: any[] = [];

  // Variable para mostrar un spinner de carga mientras se obtienen datos
  isLoading = false;

  // Filtro por defecto para búsqueda (nombre y estado)
  projectDefaultFilterSearch: any = {
    name: undefined,
    status: undefined,
  }

  // Constructor con inyección de dependencias para formularios, servicios, diálogos y notificaciones
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly projectService: ProjectsService,
    private readonly dialogModel: MatDialog,
    private readonly _sanckBar: MatSnackBar
  ) { }
  
  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.createProjectFormSearchFilter();           // Crea el formulario para filtros de búsqueda
    this.getAllProjectsByAdministrator();           // Obtiene la lista de proyectos inicial
    this.handleProjectFilterChance('name', 'name'); // Configura escucha para cambios en filtro nombre
    this.handleProjectFilterChance('status', 'status'); // Configura escucha para cambios en filtro estado
  }

  // Crea el formulario reactivo para búsqueda con controles 'name' y 'status'
  createProjectFormSearchFilter() {
    this.projectFormSearchFilter = this._formBuilder.group({
      name: [''],
      status: ['']
    });
  }

  // Método que convierte el código del estado a un nombre legible
  getStatusName(status: string): string {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'completed':
        return 'Completado';
      default:
        return 'Desconocido';
    }
  }

  // Escucha los cambios en un control específico del formulario de filtros y ejecuta la búsqueda con debounce
  handleProjectFilterChance(controlName: string, filterKey: string) {
    this.projectFormSearchFilter.controls[controlName].valueChanges.pipe(
      debounceTime(500),        // Espera 500ms para evitar búsquedas excesivas
      distinctUntilChanged()    // Solo ejecuta si el valor realmente cambió
    ).subscribe((value: any) => {
      // Actualiza el filtro con el nuevo valor
      this.projectDefaultFilterSearch[filterKey] = value;
      // Llama a la función que obtiene los proyectos con el filtro actualizado
      this.getAllProjectsByAdministrator({ ...this.projectDefaultFilterSearch, [filterKey]: value });
    });
  }

  // Obtiene todos los proyectos para el administrador, con filtros opcionales
  getAllProjectsByAdministrator(filters?: any): void {
    this.isLoading = true;  // Activa el spinner de carga
    this.projectService.getAllProjectsByAdministrator(1, filters).subscribe({
      next: (response) => {
        this.projectsList = response.projects;    // Guarda los proyectos recibidos
        this.dataSource.data = response.projects; // Actualiza la tabla con los proyectos
        this.dataSource.paginator = this.paginator; // Asocia el paginador a la tabla
        this.isLoading = false;                    // Desactiva el spinner de carga
      },
      error: (error) => {
        this.isLoading = false;                    // Desactiva el spinner en caso de error
      }
    });
  }

  // Abre un diálogo modal para crear un nuevo proyecto
  openModalCreateProject(): void {
    const dialogRef = this.dialogModel.open(ModalCreateProjectComponent, {
      minWidth: '300px',  // Ancho mínimo del modal
      maxWidth: '1000px', // Ancho máximo del modal
      width: '820px',     // Ancho inicial del modal
      disableClose: true, // Evita cerrar el modal haciendo clic fuera de él
    });

    // Después de cerrar el modal, si hubo resultado, recarga la lista de proyectos
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllProjectsByAdministrator();
      }
    });
  }

  // Abre un modal para ver detalles de un proyecto (solo lectura)
  viewProject(projectInformation: any): void {
    const dialogRef = this.dialogModel.open(ModalEditProjectsComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '820px',
      disableClose: true,
      data: { project: projectInformation, isView: true } // Envía datos al modal y flag de solo lectura
    });

    // Al cerrar, si hubo resultado, recarga la lista de proyectos
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllProjectsByAdministrator();
      }
    }); 
  }

  // Abre un modal para editar un proyecto existente
  openModalUpdateProject(projectInformation: any): void {
    const dialogRef = this.dialogModel.open(ModalEditProjectsComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '820px',
      disableClose: true,
      data: { project: projectInformation } // Envía el proyecto a editar
    });

    // Al cerrar, si hubo resultado, recarga la lista de proyectos
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllProjectsByAdministrator();
      }
    }); 
  }

  // Método para eliminar un proyecto dado su id
  deleteProject(projectId: number): void {
    this.projectService.deleteProject(projectId).subscribe({
      next: (response) => {
        // Muestra notificación de éxito al eliminar
        this._sanckBar.open(response.message, 'Cerrar', { duration: 5000 });
        // Recarga la lista de proyectos
        this.getAllProjectsByAdministrator();
      },
      error: (error) => {
        // Muestra mensaje de error si la eliminación falla
        const errorMessage = error.error?.message || 'Error al eliminar el proyecto';
        this._sanckBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }
}
