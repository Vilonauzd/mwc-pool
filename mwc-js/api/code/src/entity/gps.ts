import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {mwc_stats} from "./mwc_stats";
import {pool_stats} from "./pool_stats";
import {worker_stats} from "./worker_stats";


@Entity("gps",{schema:"pool"})
@Index("mwc_stats_id",["mwc_stats_",])
@Index("pool_stats_id",["pool_stats_",])
@Index("worker_stats_id",["worker_stats_",])
export class gps {

    @PrimaryGeneratedColumn({
        type:"bigint", 
        name:"id"
        })
    id:string;
        

    @Column("int",{ 
        nullable:true,
        name:"edge_bits"
        })
    edge_bits:number | null;
        

    @Column("float",{ 
        nullable:true,
        name:"gps"
        })
    gps:number | null;
        

   
    @ManyToOne(type=>mwc_stats, mwc_stats=>mwc_stats.gpss,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' })
    @JoinColumn({ name:'mwc_stats_id'})
    mwc_stats_:mwc_stats | null;


   
    @ManyToOne(type=>pool_stats, pool_stats=>pool_stats.gpss,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' })
    @JoinColumn({ name:'pool_stats_id'})
    pool_stats_:pool_stats | null;


   
    @ManyToOne(type=>worker_stats, worker_stats=>worker_stats.gpss,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' })
    @JoinColumn({ name:'worker_stats_id'})
    worker_stats_:worker_stats | null;

}
