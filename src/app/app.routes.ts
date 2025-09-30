import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { AplicacaoRegistro } from './components/aplicacao-registro/aplicacao-registro';
import { LoteConsulta } from './components/lote-consulta/lote-consulta';
import { FichaConsulta } from './components/ficha-consulta/ficha-consulta';
import { LoteCadastro } from './components/lote-cadastro/lote-cadastro';
import { FichaCadastro } from './components/ficha-cadastro/ficha-cadastro';
import { adminGuard } from './guards/admin-guard';
import { FichaConsultaTotal } from './components/ficha-consulta-total/ficha-consulta-total';
import { AplicacaoConsulta } from './components/aplicacao-consulta/aplicacao-consulta';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
        children: [
            {
                path: 'aplicacao',
                component: AplicacaoRegistro
            },
            {
                path: 'aplicacao/consulta',
                component: AplicacaoConsulta
            },
            {
                path: 'lotes',
                component: LoteConsulta
            },
            {
                path: 'fichas',
                component: FichaConsulta
            },
            {
                path: 'admin/lotes/novo',
                component: LoteCadastro,
                canActivate: [adminGuard]
            },
            {
                path: 'admin/fichas/nova',
                component: FichaCadastro,
                canActivate: [adminGuard]
            },
            {
                path: 'fichas/total',
                component: FichaConsultaTotal
            },
            {
                path: '',
                redirectTo: 'aplicacao',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
